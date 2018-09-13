<?php

namespace app\Api\controller;
use app\Api\validate\UserValidate;
use app\user\model\UserModel;
use cmf\controller\HomeBaseController;
use think\Db;
use think\Validate;
class UserinfoController extends HomeBaseController
{
	//从搜索点进来的用户收藏
    public function sreachUserFavorite()
    {
        $id = $_POST['id'];
        $res = DB::name('user_favorite')->where('user_id',$id)->select();
        echo json_encode($res);exit;
    }
    //从搜索点进来的用户
    public function sreachlabellimit()
    {
        $id = $_POST['id'];
        $label=DB::name('portal_tag')->order('create_time DESC')->where('status',1)->where('user_id',$id)->field('name')->limit(5)->select();
        echo json_encode($label);exit;
    }

    //搜索出来的用户信息(视频总数和图片总数)
    public function searchpcount()
    {
        $id = $_POST['id'];
        $count = DB::name('portal_post')->where('user_id',$id)->count('thumbnail');
        echo json_encode($count);exit;
    }
    public function searchvcount()
    {
        $id = $_POST['id'];
        $count = DB::name('portal_post')->where('user_id',$id)->count('post_content');
        echo json_encode($count);exit;
    }
    //用戶收藏的總數
    public function searchfcount()
    {
        $id = $_POST['id'];
        $count = DB::name('user_favorite')->where('user_id',$id)->count('url');
        echo json_encode($count);exit;
    }

	//在搜索那里点进来的用户信息
    public function searchinfo()
    {

        //所属用户ID
        $userId=intval($_POST['userid']);
        $id = intval($_POST['id']);
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        //所属用户所有信息
        $field = "u.id as user_id,u.sex,u.age,u.user_nickname,u.user_info,u.user_city,u.wx_code,u.avatar,u.receive_like_counts,u.fans_counts,u.follow_counts,a.thumbnail,a.post_content,a.num,a.id";
        $join = [
            ['portal_post a','a.user_id=u.id'],
        ];
        $user= DB::name('user')
        ->alias('u')
        ->where('u.id',$id)
        ->join($join)
        ->field($field)
        ->select();
        $arr = array();
        foreach ($user as $k => $v) {
            $arr['post_content'][]=$v['post_content'];
            $arr['num'][]=$v['num'];
            $arr['id'][]=$v['id'];
            $arr['user_nickname']=$v['user_nickname'];
            $arr['user_city']=$v['user_city'];
            $arr['avatar']=$v['avatar'];
            $arr['user_info']=$v['user_info'];
            $arr['sex']=$v['sex'];
            $image = json_decode($v['thumbnail'],true);
            $images = [];
            if(is_array($image)){
                foreach ($image as $key => $val) {
                    $images[$key]=$val['url'];
                }
            }else{
                $arr['thumbnail'][]=$images;
            }
            $arr['age']=$v['age'];
            $arr['thumbnail'][]=$images;
            $arr['user_id']=$v['user_id'];
            $arr['wx_code']=$v['wx_code'];
            $arr['receive_like_counts']=$v['receive_like_counts'];
            $arr['fans_counts']=$v['fans_counts'];
            $arr['follow_counts']=$v['follow_counts'];
        }
        echo json_encode($arr);exit;
    }
    //关注图标高亮
    public function fansShow()
    {
        $id = intval($_POST['id']);
        $res = DB::name()->find();
    }
    //用户的粉丝
    public function userfans()
    {
    	$id = intval($_POST['id']);

        $join=[
        	['__USER__ u','u.id=uc.user_id','LEFT'],
        ];
        $field='u.user_nickname,u.avatar,u.id as uid,u.user_info,u.fans_counts,u.num,uc.to_userid,uc.user_id,uc.id as ucid,uc.fansShow';
        $res = DB::name('user_concern')
        ->alias('uc')
        ->join($join)
        ->Distinct(true) //去重
        ->where('uc.to_userid',$id)
        ->where('u.id','neq','')
        ->where('u.id','neq',$id)
        ->where('openid','neq','')
        ->field($field)
        ->select();

        echo json_encode($res);exit;
    }
    //用户关注的人
    public function useratten()
    {
    	$id = intval($_POST['id']);
    	$join=[
        	['__USER__ u','u.id=uc.to_userid','LEFT'],
        ];
        $field='u.id as uid,u.user_info,u.fans_counts,u.num,uc.to_userid,uc.user_id,uc.id as ucid,uc.fansShow,uc.to_userid';
    	$res = DB::name('user_concern')->alias('uc')->join($join)->where('uc.user_id',$id)->select();
    	echo json_encode($res);exit;
    }
    //用户取消关注
    public function delete()
    {
    	$id = intval($_POST['id']);
    	$to_userid = intval($_POST['to_userid']);
    	$res = DB::name('user_concern')->where('user_id',$id)->where('to_userid',$to_userid)->delete();
    	if($res){
    		echo json_encode(array('status'=>1,'msg'=>'您已取消关注'));exit;
    	}else{
    		echo json_encode(array('status'=>1,'msg'=>'取消关注失败'));exit;
    	}
    }
}