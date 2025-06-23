from ldap3 import Server, Connection, ALL, NTLM, MODIFY_REPLACE,ALL_ATTRIBUTES,SUBTREE
from flask import Flask, request, jsonify
from flask_cors import CORS
import json


# 配置LDAP服务器信息
ldap_server = 'ldaps://server.gtcist.cn:636'
domain = 'gtcist.cn'
username = f'{domain}\\operation'
password = 'Dgut207207207!'
user_dn = 'ou=普通用户,ou=207,dc=gtcist,dc=cn'  # 用户将被创建到此OU下
use_ssl=True
# 创建LDAP连接
server = Server(ldap_server, get_info=ALL)
conn = Connection(server, user=username, password=password, authentication=NTLM)
# 连接到LDAP服务器
if not conn.bind():
    print('连接失败:', conn.last_error)
else:
    print('连接成功!')

app = Flask(__name__)
CORS(app)

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
# 请求方式 post
# 请求参数 cn
@app.route('/start',methods=['POST'])
def start():
    cn=request.get_json()
    # user_dn=request.form['user_dn']
    user_bn = f"CN={cn},ou=普通用户,ou=207,dc=gtcist,dc=cn"
    admin_dn = "CN=207,OU=普通用户,OU=207,DC=gtcist,DC=cn"
    conn.extend.microsoft.add_members_to_groups(user_bn, admin_dn)
    conn.modify(user_bn, {'userAccountControl': [(MODIFY_REPLACE, [66080])]})
    return jsonify({"message": "启用成功"})



# 查询用户
# 请求方式 post
# 请求参数 sAMAccountName
@app.route('/search',methods=['GET','POST'])
def search_user_by_account_name():
  sAMAccountName=request.form['sAMAccountName']
  conn.search(
    search_base="ou=普通用户,ou=207,dc=gtcist,dc=cn",  # 坐标
    search_filter=f"(&(objectclass=user)(sAMAccountName={sAMAccountName}))",  # 查询条件
    attributes=ALL_ATTRIBUTES, # 返回的属性
  )  # attributes 限制查询出来的属性包括
  res = conn.response_to_json()  # 将查询结果转换为json格式
  res = json.loads(res)["entries"]
  return res


# 禁用用户
# 请求方式 post
# 请求参数 cn
@app.route('/delete',methods=['POST'])
def delete():
    cn=request.get_json()
    # print(cn)
    user_bn = f"CN={cn},ou=普通用户,ou=207,dc=gtcist,dc=cn"
    # user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"
    conn.modify(user_bn, {'userAccountControl': [(MODIFY_REPLACE, [514])]})
    return jsonify({"message": "禁用成功"})


# 修改密码 
# 请求方式 post
# 请求参数 newpassword,cn
@app.route('/remake',methods=['POST'])
def remakePassword():
    cn=request.json['cn']
    user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"
    newpassword=request.json['newpassword']
    conn.extend.microsoft.modify_password(user_dn, newpassword)
    return "修改成功"

#修改个人信息 'department'学院,'description'学号,'physicalDeliveryOfficeName'班级
@app.route('/remakeInfo', methods=['POST'])
def remakeInfo():
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
#删除用户
@app.route('/deletePeople',methods=['POST'])
def deletePeople():
    cn=request.get_json()
    user_dn="cn="+cn+",ou=普通用户,ou=207,dc=gtcist,dc=cn"
    conn.delete(user_dn)
    return jsonify({"message": "删除成功"})

# 获取所有用户信息
@app.route('/main',methods=['GET'])
def getAll():
    search_base = 'ou=普通用户,ou=207,dc=gtcist,dc=cn'
    search_filter = f'(objectClass=organizationalPerson)'
    conn.search(search_base, search_filter, SUBTREE, attributes=['cn','department','description','physicalDeliveryOfficeName','userPrincipalName','sAMAccountName','userAccountControl'])
    res = conn.response_to_json()  # 将查询结果转换为json格式
    res = json.loads(res)["entries"]
    return res


if __name__ == '__main__':
    app.run(port=5000, debug=True)



