# -*- coding: UTF-8 -*- 
import os.path
import tornado.ioloop
import tornado.web
import json

from db import DB

db = DB("my.db")


class BaseHandler(tornado.web.RequestHandler):
	def prepare(self):
		print("In prepare(), checking current user\n")
		if not self.current_user:
			self.redirect("/")
			return
	def get_current_user(self):
		return self.get_secure_cookie("user")

class LoginHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('login.html')
	def post(self):
		id = self.get_argument('id')
		pw = self.get_argument('password')
		print( (id,pw) )
		if str(db.selectPasswordById(id)) == str(pw):
			self.set_secure_cookie("user", id)
			self.set_secure_cookie("password", pw)
			self.redirect("/healthHelper")
		else:
			self.redirect('/')
		
class LogoutHandler(BaseHandler):
	def post(self):
		self.set_secure_cookie("user", "")
		self.redirect('/')

class RegisterHandler(tornado.web.RequestHandler):
	def post(self):
		self.render('register.html')
		
class RegisterCheckHandler(tornado.web.RequestHandler):
	def get(self):
		#user和password是用户注册时记录的
		user = self.get_argument('user');
		pw = self.get_argument('password');
		newid = db.insertUserTable(None, pw, user, json.dumps([]))
		print("in RegisterCheckHandler", newid)
		self.write(json.dumps(newid))
			
class HealthHelperHandler(BaseHandler):
	def get(self):
		self.render('HealthHelper.html')
		
		
		
		
		
		
		
class PlanDoneHandler(BaseHandler):
	def get(self):
		data = [{'sportType':'跑步','place':'操场','st':"yyyy-mm-dd HH:MM:SS",'et':"yyyy-mm-dd HH:MM:SS" },{'sportType':'跑步','place':'操场','st':"yyyy-mm-dd HH:MM:SS",'et':"yyyy-mm-dd HH:MM:SS" }]
		self.write(json.dumps(data))
		
class PlanUndoneHandler(BaseHandler):
	def get(self):
		#data = [{'sportType':'跑步','place':'操场','st':"yyyy-mm-dd HH:MM:SS",'et':"yyyy-mm-dd HH:MM:SS" },{'sportType':'跑步','place':'操场','st':"yyyy-mm-dd HH:MM:SS",'et':"yyyy-mm-dd HH:MM:SS" }]
		data = ''
		self.write(json.dumps(data))

#因为在js中已经检查过时间的正确性，所以在这里只需要把新计划放入数据库即可。
class CreatePlanHandler(BaseHandler):
	def get(self):
		st = self.get_argument("st")
		print st
		self.write(json.dumps("Create succeed!"))
		
class RecordWeekHandler(BaseHandler):
	def get(self):
		data = [{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS", 'sportTime':600,'calorie':10000,'distance':1000},{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS", 'sportTime':600,'calorie':10000,'distance':1000}]
		self.write(json.dumps(data))
		
class RecordMonthHandler(BaseHandler):
	def get(self):
		data = [{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS", 'sportTime':600,'calorie':10000,'distance':1000},{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS", 'sportTime':600,'calorie':10000,'distance':1000}]
		self.write(json.dumps(data))
		
		
		
class AddRecordHandler(tornado.web.RequestHandler):
	def get(self):
		print("AddRecordHandler not done!")
		self.write( json.dumps("AddRecordHandler not done!") )
		
		
				
class InvitProHandler(BaseHandler):
	def get(self):
		data = [{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS",'invitee':[1,2,3]},{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS",'invitee':[1,2,3]}]
		print data
		self.write(json.dumps(data))
		
class InvitPendHandler(BaseHandler):
	def get(self):
		data = [{'sportType':'跑步', 'place':'操场','st':"yyyy-mm-dd HH:MM:SS", 'et':"yyyy-mm-dd HH:MM:SS",'invitee':[1,2,3]}]
		self.write(json.dumps(data))
		
class SendInvitHandler(BaseHandler):
	def get(self):
		print self.get_argument("invitee");
		self.write(json.dumps("Invitation has been sent"));
		
		
		
		
	

	
class GetFriendListHandler(BaseHandler):
	def get(self):
		#data = [{'id':'1', 'name':'Jeny'}, {'id':'2', 'name': 'Tom'},
		#{'id':'3', 'name':'Jeny'},{'id':'4', 'name':'Jeny'},{'id':'5', #'name':'Jeny'},{'id':'6', 'name':'Jeny'},{'id':'7', 'name':'Jeny'}]
		me = self.current_user
		data = db.getFriendInfoById(me)
		print ("In GetFriendListHandler", me, data)
		self.write(json.dumps(data))
	
class AddFriendHandler(BaseHandler):
	def get(self):
		me = self.current_user
		fid = self.get_argument("id");
		print (type(fid), "me,friend", me, fid, "In AddFriendHandler ")
			
		if db.addFriendInfo(me, fid) == False:
			self.write(json.dumps(""))
		else:
			friendname = db.selectNameById(fid)
			data = {'id': fid, 'name':friendname}
			self.write(json.dumps(data)) #如果添加的好友不存在，则返回空串
		
class DelFriendHandler(BaseHandler):
	def get(self):
		fids = self.get_argument("id");
		me = self.current_user
		for fid in fids.split(','):
			print ("In DelFriendHandler", (me, fid), type(fid) )
			if fid != "":
				db.delFriendInfo(me,fid)
		self.write(json.dumps('Delete succeed!'))
	
app = tornado.web.Application(
[(r"/", LoginHandler),
(r"/logout", LogoutHandler),
(r"/register", RegisterHandler),
(r"/registerCheck", RegisterCheckHandler),
(r"/healthHelper", HealthHelperHandler),

(r"/planDone", PlanDoneHandler),
(r"/planUndone", PlanUndoneHandler),
(r"/recordWeek", RecordWeekHandler),
(r"/recordMonth", RecordMonthHandler),

(r"/invitPro", InvitProHandler),
(r"/invitPend", InvitPendHandler),
(r"/createPlan", CreatePlanHandler),
(r"/sentInvit", SendInvitHandler),
(r"/getFriendList", GetFriendListHandler),
(r"/addFriend", AddFriendHandler),
(r"/delFriend", DelFriendHandler),



(r"/ios/", HealthHelperHandler),
(r"/ios/logout", LogoutHandler),
(r"/ios/register", RegisterHandler),
(r"/ios/registerCheck", RegisterCheckHandler),
(r"/ios/healthHelper", HealthHelperHandler),

(r"/ios/planDone", PlanDoneHandler),
(r"/ios/planUndone", PlanUndoneHandler),
(r"/ios/recordWeek", RecordMonthHandler),
(r"/ios/recordMonth", RecordMonthHandler),
(r"/ios/addRecord", AddRecordHandler),

(r"/ios/invitPro", InvitProHandler),
(r"/ios/invitPend", InvitPendHandler),
(r"/ios/createPlan", CreatePlanHandler),
(r"/ios/sentInvit", SendInvitHandler),
(r"/ios/getFriendList", GetFriendListHandler),
(r"/ios/addFriend", AddFriendHandler),
(r"/ios/delFriend", DelFriendHandler),

],
cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=" ,
template_path = os.path.join(os.path.dirname(__file__), "template"),
static_path = os.path.join(os.path.dirname(__file__), "static"),
debug=True
)

if __name__ == "__main__":
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()