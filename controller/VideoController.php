<?php


namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use think\Db;
class VideoController extends HomeBaseController
{
	public function index()
	{
		$user_id = $_POST['user_id'];
		$id = $_POST['id'];
		if(!$user_id){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $join = [
        	['__USER__ u','a.user_id=u.id'],
        ];
        $field = "u.id as to_userid,u.user_nickname,u.avatar,a.post_content,a.post_like,a.post_collect,a.comment_count,a.post_desc,a.post_favorites,a.id as arid,a.thumbnail";
        $res = DB::name('portal_post')->alias('a')->join($join)->where('a.id',$id)->field($field)->find();
		echo json_encode($res);exit;
	}
}