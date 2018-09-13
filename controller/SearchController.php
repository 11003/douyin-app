<?php
namespace app\Api\controller;
use app\Api\validate\UserValidate;
use app\res\model\UserModel;
use cmf\controller\HomeBaseController;
use think\Db;
use think\Validate;
class SearchController extends HomeBaseController
{
	public function index()
	{
		//所属用户ID
        $userid = $_POST['userid'];
		if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $field = "post_desc,thumbnail,post_content,num,id";
        $res = DB::name('portal_post')->field($field)->order('published_time DESC')->where('post_content','NEQ','')->select();
        
        $arr = array();
        foreach ($res as $k => $v) {
            $image = json_decode($v['thumbnail'],true);
            $images = [];
            if(is_array($image)){
                foreach ($image as $key => $val) {
                    $images[$key]=$val['url'];
                }
            }else{
                $arr['thumbnail']=$images;
            }
        	$arr['thumbnail']=$images;
            $arr['post_content'][]=$v['post_content'];
            $arr['num'][]=$v['num'];
            $arr['id'][]=$v['id'];
            $arr['post_desc'][]=$v['post_desc'];
        }
		echo json_encode($arr);exit;
	}

	public function user()
	{
		//所属用户ID
        $userid = $_POST['userid'];
		if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $field = 'num,user_nickname,user_info,avatar,receive_like_counts,fans_counts,id';
        $res = DB::name('user')
        ->field($field)
        ->order('fans_counts DESC')
        ->where('user_status','eq',1)
        ->where('openid','neq','')
        ->where('id','neq',$userid)
        ->where('user_nickname','neq','')
        ->select();

		echo json_encode($res);exit;
	}
	//搜索接口
	public function keywords()
	{
		//所属用户ID
        $userid = $_POST['userid'];
		if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $keywords = $_POST['keywords'];
        $cid = $_POST['cid'];	//小程序传过来区分视频和用户
        //视频查询
        if($cid == 1){
        	$map['post_desc']=['LIKE','%'.$keywords.'%'];
			$vres = DB::name('portal_post')->where($map)->select();

			$arr = array();
	        foreach ($vres as $k => $v) {
	        	$arr['thumbnail'][]=$v['thumbnail'];
	            $arr['post_content'][]=$v['post_content'];
	            $arr['num'][]=$v['num'];
	            $arr['id'][]=$v['id'];
	            $arr['post_desc'][]=$v['post_desc'];
	        }
			echo json_encode($arr);exit;
        }
        //用户查询
        elseif ($cid == 2) {
        	$map['user_nickname'] = ['LIKE','%'.$keywords.'%'];
        	$ures = DB::name('user')->where($map)->order('fans_counts DESC')->where('user_status','=',1)->where('user_pass','=','')->select();

        	$arr = array();
	        foreach ($ures as $k => $v) {
	        	$arr['user_nickname'][]=$v['user_nickname'];
	            $arr['user_info'][]=$v['user_info'];
	            $arr['avatar'][]=$v['avatar'];
	            $arr['receive_like_counts'][]=$v['receive_like_counts'];
	            $arr['fans_counts'][]=$v['fans_counts'];
	            $arr['id'][]=$v['id'];
                $arr['num'][]=$v['num'];
	        }
		echo json_encode($arr);exit;
        }else{
        	echo json_encode(array('status'=>0,'err'=>'输入有误！'));exit;
        }
	}
}