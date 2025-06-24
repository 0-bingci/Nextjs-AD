from ldap3 import Server, Connection, ALL, NTLM, MODIFY_REPLACE, ALL_ATTRIBUTES, SUBTREE
from flask import Flask, request, jsonify, session,make_response
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os
import json
import threading
import time 

# 配置LDAP服务器信息
ldap_server = 'ldaps://server.gtcist.cn:636'
domain = 'gtcist.cn'
username = f'{domain}\\operation'  # 或者尝试直接使用 'operation'
password = 'Dgut207207207!'  # 确保密码正确
user_dn = 'ou=普通用户,ou=207,dc=gtcist,dc=cn'  # 用户将被创建到此OU下
use_ssl = True
HEARTBEAT_INTERVAL = 300  # 每5分钟执行一次心跳查询

app = Flask(__name__)
app.secret_key = 'Dgut.gtcist'
app.secret_key = os.urandom(24)  # 设置一个随机密钥用于会话管理
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# 预设的用户名和密码
ADMIN_ACCOUNT = 'root'
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'Dgut207207207!')

# 全局连接对象
global_conn = None
lock = threading.Lock()

def create_ldap_connection():
    try:
        server = Server(ldap_server, use_ssl=use_ssl, get_info=ALL)
        conn = Connection(server, user=username, password=password, authentication=NTLM)
        if not conn.bind():
            print(f'绑定失败: {conn.last_error}')
            return None
        print("LDAP 连接成功")
        return conn
    except Exception as e:
        print(f"创建LDAP连接时出错: {e}")
        return None

def heartbeat():
    global global_conn
    while True:
        with lock:
            if global_conn and global_conn.bound:
                try:
                    global_conn.extend.standard.who_am_i()  # 心跳查询
                except Exception as e:
                    print(f"心跳查询失败: {e}")
                    global_conn.unbind()
                    global_conn = None
            if not global_conn or not global_conn.bound:
                global_conn = create_ldap_connection()
        time.sleep(HEARTBEAT_INTERVAL)

# 启动心跳线程
heartbeat_thread = threading.Thread(target=heartbeat, daemon=True)
heartbeat_thread.start()

def ensure_connection():
    global global_conn
    with lock:
        if not global_conn or not global_conn.bound:
            print("连接未建立或已断开，尝试重连...")
            global_conn = create_ldap_connection()
        return global_conn

# 创建用户
# 请求方式 post
# 请求参数 'cn'姓名,'department'学院,'description'学号,'physicalDeliveryOfficeName'班级,'sAMAccountName'账号  password  'userPrincipalName'
@app.route('/create',methods=['POST'])
def create():
    cn=request.json['cn']
    parts = cn.split()
    sn = parts[0]
    # givenName=' '.join(parts[1:])
    givenName='占位'
    department=request.json['department']
    description=request.json['description']
    physicalDeliveryOfficeName=request.json['physicalDeliveryOfficeName']
    sAMAccountName=request.json['sAMAccountName']
    userPrincipalName=sAMAccountName+'@gtcist.cn'
    new_user_dn = f"CN={cn},ou=普通用户,ou=207,dc=gtcist,dc=cn"  # 用户的DN
    password = request.json['password']  # 用户初始密码
    user_attributes = {
    'physicalDeliveryOfficeName':physicalDeliveryOfficeName,
    'department':department,
    'description':description,
    'objectClass': ['top', 'person', 'organizationalPerson', 'user'],
    'sAMAccountName': sAMAccountName,
    'userPrincipalName': userPrincipalName,
    'givenName':givenName,
    'sn': sn,
    'displayName': cn,
}
    print(new_user_dn)
    conn = ensure_connection()
    # 添加新用户到AD
    conn.add(new_user_dn, attributes=user_attributes)
    if conn.result['description'] == 'success':
        print('用户创建成功')
    # 设置密码
        conn.extend.microsoft.modify_password(new_user_dn, password)

    # 启用用户账户
        conn.modify(new_user_dn, {'userAccountControl': [(MODIFY_REPLACE, [514])]})
        print('用户密码设置成功且账户已禁用')
    else:
        print('用户创建失败:', conn.result['description'])
    return jsonify({"message": "创建成功"})

# 启用用户
@app.route('/start',methods=['POST'])
def start():
    cn=request.get_json()
    # user_dn=request.form['user_dn']
    user_bn = f"CN={cn},ou=普通用户,ou=207,dc=gtcist,dc=cn"
    admin_dn = "CN=207,OU=普通用户,OU=207,DC=gtcist,DC=cn"
    conn = ensure_connection()
    conn.extend.microsoft.add_members_to_groups(user_bn, admin_dn)
    conn.modify(user_bn, {'userAccountControl': [(MODIFY_REPLACE, [66080])]})
    return jsonify({"message": "启用成功"})


# 查询用户
@app.route('/search', methods=['GET', 'POST'])
def search_user_by_account_name():
    sAMAccountName = request.form['sAMAccountName']

    conn = ensure_connection()

    conn.search(
            search_base=user_dn,
            search_filter=f"(&(objectclass=user)(sAMAccountName={sAMAccountName}))",
            attributes=ALL_ATTRIBUTES,
        )
    res = conn.response_to_json()
    res = json.loads(res)["entries"]
    return res


# 禁用用户
@app.route('/delete',methods=['POST'])
def delete():
    conn = ensure_connection()
    cn=request.get_json()
    # print(cn)
    user_bn = f"CN={cn},ou=普通用户,ou=207,dc=gtcist,dc=cn"
    # user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"
    conn.modify(user_bn, {'userAccountControl': [(MODIFY_REPLACE, [514])]})
    return jsonify({"message": "禁用成功"})

# 修改密码
@app.route('/remake',methods=['POST'])
def remakePassword():
    cn=request.json['cn']
    user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"
    newpassword=request.json['newpassword']
    conn = ensure_connection()
    conn.extend.microsoft.modify_password(user_dn, newpassword)
    return "修改成功"

# 修改个人信息
@app.route('/remakeInfo', methods=['POST'])
def remakeInfo():
    conn = ensure_connection()
    try:
        data = request.get_json()
        if not data or 'cn' not in data:
            return jsonify({"error": "'cn' is required"}), 400

        cn = data['cn']
        user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"

        # 构建修改属性字典
        attributes = {}
        if 'department' in data:
            attributes['department'] = [(MODIFY_REPLACE, [data['department']])]
        if 'description' in data:
            attributes['description'] = [(MODIFY_REPLACE, [data['description']])]
        if 'physicalDeliveryOfficeName' in data:
            attributes['physicalDeliveryOfficeName'] = [
                (MODIFY_REPLACE, [data['physicalDeliveryOfficeName']])
            ]

        if not conn.bind():
            return jsonify({"error": "Failed to connect to LDAP server"}), 500

        # 执行修改操作
        if not conn.modify(user_dn, attributes):
            return jsonify({"error": "LDAP modify failed", "details": conn.result}), 500

        # 检查 LDAP 操作结果
        if not conn.result['description'] == 'success':
            error_msg = conn.result.get('message', 'Unknown error')
            return jsonify({"error": error_msg}), 500

        return jsonify({"message": "修改成功"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# 删除用户
@app.route('/deletePeople',methods=['POST'])
def deletePeople():
    conn = ensure_connection()
    cn=request.get_json()
    user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"
    conn.delete(user_dn)
    return jsonify({"message": "删除成功"})


# 获取所有用户信息
@app.route('/main', methods=['GET'])
def getAll():
    search_base = user_dn
    search_filter = '(objectClass=organizationalPerson)'

    conn = ensure_connection()

    conn.search(search_base, search_filter, SUBTREE, attributes=[
            'cn', 'department', 'description', 'physicalDeliveryOfficeName',
            'userPrincipalName', 'sAMAccountName', 'userAccountControl'
        ])
    res = conn.response_to_json()
    res = json.loads(res)["entries"]
    return res

# 登录路由
@app.route('/login', methods=['POST'])
def loginSystem():
    try:
        data = request.json
        account = data.get('account')
        pwd = data.get('password')

        if account == ADMIN_ACCOUNT and pwd == ADMIN_PASSWORD:
            token = jwt.encode({
            'username': 'admin',
            'exp': datetime.utcnow() + timedelta(hours=1)
            }, 'your_secret_key', algorithm='HS256')
            return jsonify({"token": token})
        else:
            return jsonify({"message": "登录失败"}), 401
    except Exception as e:
        app.logger.error(f"登录失败: {e}", exc_info=True)
        return jsonify({"error": "内部服务器错误"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)



