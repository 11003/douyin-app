<?php
namespace app\Api\controller;
use app\Api\validate\UserValidate;
use app\res\model\UserModel;
use cmf\controller\HomeBaseController;
use think\Db;
use think\Validate;
class ConcernController extends HomeBaseController
{
	//总关注表
	public function attention()
	{
		$user_id=$_POST['userid'];
		if(!$user_id){
            echo json_encode(array('status'=>0,'msg'=>'你还没有登录！'));exit;
        }
        $field='
        		a.thumbnail,a.id as arid,a.post_content,
        		uc.id as ucid,uc.user_id,uc.to_userid,uc.to_username,uc.to_avatar,
                u.id
                ';
        $join = [
            ['__USER_CONCERN__ uc','uc.to_userid=a.user_id','LEFT'],
            ['__USER__ u','u.id=uc.to_userid']
        ];
        $res = DB::name('portal_post')
        ->alias('a')
        ->join($join)
        ->where('uc.user_id',$user_id)
        ->field($field)
        ->order('post_content DESC')
        ->whereNotNull('to_userid')            
        ->select();
        $arr = array();
        foreach ($res as $key => $v) {
            $image = json_decode($v['thumbnail'],true);
            $images = [];
            if(is_array($image)){
                foreach ($image as $key => $val) {
                    $images[$key]=$val['url'];
                }
            }else{
                $v['thumbnail']=$images;
            }
            $v['thumbnail']=$images;
            $arr[]=$v;
        }
        echo json_encode($arr);exit;
	}
	//粉丝关注
	public function searchCon()
	{
		$userId=$_POST['userid'];   //粉丝
		$to_userid = $_POST['to_userid'];   //明星

        if(!$userId){
            echo json_encode(array('status'=>0,'msg'=>'你还没有登录！'));exit;
        }
        if(!$to_userid){
            echo json_encode(array("status"=>0,"msg"=>"关注失败"));exit;
        }
        if($userId == $to_userid){
            echo json_encode(array("status"=>0,"msg"=>"您不能關注自己"));exit;
        }
        if(DB::name('user_concern')->where('user_id',$userId)->where('to_userid',$to_userid)->find()){
        	echo json_encode(array('status'=>0,'msg'=>'已关注了Ta！'));exit;
        }
        //粉丝关注用户
        
        $data = [
            'user_id'=>$userId,
            'to_userid'=>$to_userid,
            'is_fansShow'=>1
        ];

        $res=DB::name('user_concern')->insert($data);
        DB::name('user')->where('id',$to_userid)->setInc('fans_counts', 1);

        if($res){
            //查看用户关注的人是否是他的粉丝
            $is_fan = DB::name('user_concern')->where('to_userid',$userId)->where('user_id',$to_userid)->find();
            if($is_fan){
            DB::name('user_concern')->where('user_id',$userId)->where('to_userid',$to_userid)->setField('fansShow',1);
            DB::name('user_concern')->where('to_userid',$userId)->where('user_id',$to_userid)->setField('fansShow',1);
            }
            echo json_encode(array('status'=>1,'msg'=>'关注成功!','fansShow'=>'true'));exit;
        }else{
            echo json_encode(array('status'=>0,'msg'=>'关注失败!','fansShow'=>'false'));exit;
        }
	}
    //粉丝取消关注
    public function delete()
    {
        $userId=$_POST['userid'];   //粉丝
        $to_userid = $_POST['to_userid'];   //明星
        if(!$userId){
            echo json_encode(array('status'=>0,'msg'=>'你还没有登录！'));exit;
        }
        if(!$to_userid){
            echo json_encode(array("status"=>0,"msg"=>"取消关注失败"));exit;
        }

    }
}