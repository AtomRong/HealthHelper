# -*- coding: UTF-8 -*- 
import os.path
import tornado.ioloop
import tornado.web
import json

class LoginHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('login.html')
	
		
class LogoutHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('HealthHelper.html')

class RegisterHandler(tornado.web.RequestHandler):
	def get(self):
		self.render('register.html')
		
class RegisterCheckHandler(tornado.web.RequestHandler):
	def get(self):
		user = self.get_argument('user');
		pw = self.get_argument('password');
		id = "1245"
		self.write(json.dumps(id))

		
class HealthHelperHandler(tornado.web.RequestHandler):
	def get(self):
		id = self.get_argument('id')
		pw = self.get_argument('password')
		print id
		print pw
		if id == '1245' and pw == '111111':
			self.render('HealthHelper.html')
		else:
			self.redirect('/')
		
class PlanDoneHandler(tornado.web.RequestHandler):
	def get(self):
		#data = [["2014-06-11 20:00","2014-06-11 20:30","内环", "running"], ["2014-06-13 20:00","2014-06-13 20:30","内环", "running"]]
		data = ''
		self.write(json.dumps(data))
		
class PlanUndoneHandler(tornado.web.RequestHandler):
	def get(self):
		data = [["2014-07-11 20:00","2014-07-11 20:30","内环", "running"], ["2014-07-13 20:00","2014-07-13 20:30","内环", "running"]]
		self.write(json.dumps(data))

#因为在js中已经检查过时间的正确性，所以在这里只需要把新计划放入数据库即可。
class CreatePlanHandler(tornado.web.RequestHandler):
	def get(self):
		begin = self.get_argument("begin")
		self.write(json.dumps("Create succeed!"))
		
class RecordWeekHandler(tornado.web.RequestHandler):
	def get(self):
		data = [["2014-07-11 20:00","2014-07-11 20:30","内环", 17, 20, 30], ["2014-07-13 20:00","2014-07-13 20:30","内环", 20, 25 ,33]]
		self.write(json.dumps(data))
		
class RecordMonthHandler(tornado.web.RequestHandler):
	def get(self):
		data = [["2014-06-11 20:00","2014-06-11 20:30","内环", 17,20,30], ["2014-06-13 20:00","2014-06-13 20:30","内环", 20, 25, 33]]
		self.write(json.dumps(data))
		
class InvitProHandler(tornado.web.RequestHandler):
	def get(self):
		data = [["2014-06-11 20:00","内环", "running", "Lily", ["Join", "Mary"]], ["2014-06-13 20:00","内环", "running", "Tom", ["Henrry"]]]
		self.write(json.dumps(data))
		
class InvitPendHandler(tornado.web.RequestHandler):
	def get(self):
		data = [["2014-07-11 20:00","内环", "running", "Lily", ["Join", "Mary"]], ["2014-07-13 20:00","内环", "running", "Tom", ["Henrry"]]]
		self.write(json.dumps(data))
		
class SendInvitHandler(tornado.web.RequestHandler):
	def get(self):
		print self.get_argument("invitees");
		self.write(json.dumps("Invitation has been sent"));
		
class GetFriendListHandler(tornado.web.RequestHandler):
	def get(self):
		data = [{'id':'1', 'name':'Jeny'}, {'id':'2', 'name': 'Tom'},
		{'id':'3', 'name':'Jeny'},{'id':'4', 'name':'Jeny'},{'id':'5', 'name':'Jeny'},{'id':'6', 'name':'Jeny'},{'id':'7', 'name':'Jeny'}]
		#data = ''
		self.write(json.dumps(data))
	
class AddFriendHandler(tornado.web.RequestHandler):
	def get(self):
		id = self.get_argument("id");
		print id
		data = [{'id': id, 'name':'hello'}]
		self.write(json.dumps(data))
		
		#如果添加的好友不存在，则返回空串
		#self.write(json.dumps(""))
		
class DelFriendHandler(tornado.web.RequestHandler):
	def get(self):
		id = self.get_argument("id");
		print id
		self.write(json.dumps('Delete succeed!'))
	
app = tornado.web.Application(
[(r"/", LoginHandler),
(r"/logout", LogoutHandler),
(r"/register", RegisterHandler),
(r"/registerCheck", RegisterCheckHandler),

(r"/healthHelper", HealthHelperHandler),
(r"/planDone", PlanDoneHandler),
(r"/planUndone", PlanUndoneHandler),
(r"/recordWeek", RecordMonthHandler),
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
(r"/ios/invitPro", InvitProHandler),
(r"/ios/invitPend", InvitPendHandler),
(r"/ios/createPlan", CreatePlanHandler),
(r"/ios/sentInvit", SendInvitHandler),
(r"/ios/getFriendList", GetFriendListHandler),
(r"/ios/addFriend", AddFriendHandler),
(r"/ios/delFriend", DelFriendHandler),

],
template_path = os.path.join(os.path.dirname(__file__), "template"),
static_path = os.path.join(os.path.dirname(__file__), "static"),
debug=True
)

if __name__ == "__main__":
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()