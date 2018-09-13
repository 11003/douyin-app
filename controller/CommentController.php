<?php

/**
 * 评价接口
 */
namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use think\Db;
class CommentController extends HomeBaseController
{
	/**
	 * 视频相关评论
	 * @return [type] [description]
	 */
	public function index()
	{
		$userid = $_POST['userid'];
		$arid = $_POST['id'];
		if(!$userid){
			echo json_encode(array("status"=>0,"msg"=>"您尚未登陆"));exit;
		}
		$field='
				u.id,u.avatar,u.user_nickname,
				c.id as comment_id,c.like_count,c.object_id,c.content,c.user_id,
				l.isshow';
		$join = [
			['__USER__ u','u.id=c.user_id','LEFT'],
			['__COMMENT_LIKE__ l','l.comment_id=c.id','LEFT']   //点赞图标高亮
		];
		$res = DB::name('comment')->alias('c')->join($join)->field($field)->order('c.create_time DESC')->where('object_id',$arid)->select();

		//点赞的w、k
		$arr = array();
		foreach ($res as $k => $v) {
			if(empty($v['isshow'])){
				$v['isshow']=0;
			}else{
				$v['isshow']=1;
			}
			if($v['like_count']>=10000){
			   $v['like_count'] = ($v['like_count']/10000);
			   $v['like_count'] = substr($v['like_count'],0,3)."w+";
		    }elseif($v['like_count']>=1000){
		    	$v['like_count'] = ($v['like_count']/1000);
		    	$v['like_count'] = substr($v['like_count'],0,3)."k+";
		    }else{
		    	$v['like_count']=$v['like_count'];
		    }
		    $arr[]=$v;
		}
		
		echo json_encode($arr);exit;
	}

	public function addLike()
	{
		$userid = $_POST['userid'];
		$to_userid = intval($_POST['to_userid']);
		$comment_id = $_POST['comment_id'];
		$isshow = intval($_POST['isshow']);
		$arid = $_POST['arid'];

		if($isshow == 0){

			if(DB::name('comment_like')->where('comment_id',$comment_id)->where('user_id',$userid)->find()){echo json_encode(array("status"=>0,"msg"=>"你已经赞过了!"));exit;}
			$data = [
				'user_id'     =>$userid,
				'to_user_id'  =>$to_userid,
				'comment_id'  =>$comment_id,
				'arid'        =>$arid,
				'create_time' =>time(),
				'isshow'      =>1
			];
			DB::name('comment_like')->insert($data);
			//同时给用户也获赞
            DB::name('user')->where('id',$to_userid)->setInc('receive_like_counts', 1);
			//统计用户喜爱表
			DB::name('comment')->where('id',$comment_id)->setInc('like_count', 1);
			echo json_encode(array("status"=>1,"msg"=>"点赞成功!"));exit;
		}elseif($isshow == 1){

			DB::name('comment_like')
            ->where('user_id',$userid)
            ->where('comment_id',$comment_id)
            ->delete();
            //同时给用户也取消赞
            DB::name('user')->where('id',$to_userid)->where('receive_like_counts>0')->setDec('receive_like_counts', 1);
            //统计用户喜爱表
			DB::name('comment')->where('id',$comment_id)->where('like_count>0')->setDec('like_count', 1);
			echo json_encode(array("status"=>0,"msg"=>"取消点赞!"));exit;
		}
	}


	/**
	 * 相关视频的评论总数
	 * @return [type] [description]
	 */
	public function count()
	{
		$arid = $_POST['id'];
		$count = DB::name('comment')->where('object_id',$arid)->count('id');
		echo json_encode($count);exit;
	}


	/**
	 * 给视频评论,提交评论
	 */
	public function info()
	{
		$id = $_POST['id'];
		$userid = $_POST['userid'];
		$comment = $_POST['comment'];
		$to_userid = intval($_POST['to_userid']);
		if(!$userid){
			echo json_encode(array("status"=>0,"msg"=>"您尚未登陆"));exit;
		}
		$data = [
			'object_id'  => $id,
			'user_id'    => $userid,
			'content'	 => $comment,
			'to_user_id'  => $to_userid,
			'create_time' => time()
		];
		
		//同时给相关的视频加载评论总数
		DB::name('portal_post')->where('id',$id)->setInc('comment_count', 1);
		$comment_id=DB::name('comment')->insert($data);
		if($comment_id){
			echo json_encode(array("status"=>1,"msg"=>"评论成功"));exit;
		}else{
			echo json_encode(array("status"=>0,"msg"=>"评论失败"));exit;
		}
	}
}