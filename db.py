# -*- coding: UTF-8 -*- 
import sqlite3
import json

class DB:
	def __init__(self, name):
		self.db = sqlite3.connect(name)
		self.curs = self.db.cursor()
		self.curs.execute(
			"""create table if not exists user ( 
			id integer not null primary key AUTOINCREMENT, 
			password text not null,
			name text not null,
			friendlist text)""")
		self.db.commit()
		
		# id 是计划的制定人，同时也是邀请人， tag表示现在是 "plan" < "invitation" < "record"
		# st, et 时间格式必须是 2011-01-01 12:34:56 
		# id, st, et 作为复合键, 因为一个人在一段时间内只允许完成一个计划
		# sportTime 记录秒数，
		# invitee 是一个 json列表，存储 用户id
		self.curs.execute(""" create table if not exists record ( 
			id integer , 
			tag text, 
			st text not null, 
			et text not null,
			place text not null,
			sportType text not null,

			sportTime integer, 
			distance integer,
			calorie integer,

			invitee text,
			PRIMARY KEY(id,st,et),
			FOREIGN KEY(id) REFERENCES user(id) ) """)
		self.db.commit()
		
################## User table Operation   #######################			
	def insertUserTable(self, *para):
		print( para )
		format = ["?"] *  len(para)
		format = ",".join(format)
		query = """insert into user values (""" + format + """)""" 
		print( "query \n" + query )
		
		self.curs.execute( query, para )
		self.db.commit()
		
		self.curs.execute("select last_insert_rowid() newid")  #获得自增主键的值
		return self.curs.fetchone()[0]
		
	def selectPasswordById(self, id):
		print("In selectPasswordById ", id)
		query = "select password from user where id=?"
		self.curs.execute( query, str(id) )
		result = self.curs.fetchone()
		if result == None:
			return None
		else:
			return result[0]
	
	def selectNameById(self, id):
		query = "select name from user where id=?"
		self.curs.execute( query, str(id) )
		result = self.curs.fetchone()
		if result == None:
			return None
		else:
			return result[0]
	
	def selectFriendListById(self, id):
		query = "select friendlist from user where id=?"
		self.curs.execute( query, str(id) )
		result = self.curs.fetchone() #拿到的是 json.dumps出来的unicode字符串；
		if result == None:
			return None
		else:
			return result[0]
	
	
	def getFriendInfoById(self, id):
		"""以[(id,name), ()]形式 返回friend的 id,name
		"""
		friendIDs = self.selectFriendListById(id)
		friendIDs = json.loads(friendIDs)
		friendNames = []
		for i in friendIDs:
			name = self.selectNameById(i)
			friendNames.append(name)
			
		friendInfo = zip(friendIDs ,friendNames)
		result = []
		for i in friendInfo:
			d = {}
			d["id"] = i[0]
			d["name"] = i[1]
			result.append(d)
		return result
			
################## Record table Operation   #######################			
	def insertRecordTable(self, *para):
		print( para )
		format = ["?"] *  len(para)
		format = ",".join(format)
		print(len(format))
		query = """insert into record values (""" + format + """)""" 
		print( "query \n" + query )
		
		self.curs.execute( query, para )
		self.db.commit()
		
		
		# 根据复合主键 进行update
	def updateRecordTablePK(self, id, st, et, **para):
		print(para)
		format = []
		for key in para:
			s = key + "=" + str(para[key])
			format.append(s)
		format = ",".join(format)
		print(format)
		
		query = """update record set """ + format + """ where id=%d and st="%s" and et="%s" """ %( id,st,et )
		print(query)
		self.curs.execute(query)
		self.db.commit();
			
if __name__ == "__main__":
	db = DB("my.db")
	"""
	db.insertUserTable(None, "tom", "Tom", json.dumps([1,2,3]))
	db.insertUserTable(None, "xue", "Xue", json.dumps([1,2,3]))
	db.insertUserTable(None, "tina", "Tina", json.dumps([1,2,3]))
	db.insertUserTable(None, "xiana", "Xiana", json.dumps([1,2,3]))
	db.insertUserTable(None, "mei", "Mei", json.dumps([1,2,3]))
	db.insertUserTable(None, "bob", "Bob", json.dumps([1,2,3]))
	"""	
	
	print db.selectNameById(5)
	print db.selectPasswordById(5)
	print db.selectFriendListById(5)
	print db.getFriendInfoById(5)
	

	db.insertRecordTable( 1, "plan", "2014-09-29 11:25", "2014-09-29 13:00", u"真草场", u"跑步",  None, None, None, json.dumps(""))
	db.insertRecordTable( 1, "plan", "2014-08-29 23:25", "2014-09-1 12:00",  u"假草场", u"跑步",  None, None, None, json.dumps(""))
	
	db.updateRecordTablePK( 1, "2014-08-29 23:25", "2014-09-1 12:00", distance=1000, calorie=10000, sportTime=3600)
	
	
	
	
"""
create table if not exists record ( id integer foreign key, json_records text )
create table if not exists user ( 
	id integer not null primary key AUTOINCREMENT, 
	password text not null,
	name text not null,
	friendlist text)


update user set name="qwe" where id=5

select name from user where id=5

SELECT Persons.LastName, Persons.FirstName, Orders.OrderNo
FROM Persons, Orders
WHERE Persons.Id_P = Orders.Id_P 



"""	
	
	
# cmd cd /d E:\ & python dbtest.py & ECHO. & PAUSE ;
# cmd /k cd /d D:\HealthHelper &  python "ajax_server.py" & ECHO. & PAUSE;