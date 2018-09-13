<?php

namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use app\portal\model\PortalTagModel;
use think\Db;
class FansController extends HomeBaseController
{
	public function fans()
	{
		$user_id = $_POST['userid'];
        if(!$user_id){
            echo json_encode(array("status"=>0,"msg"=>"尚未登录"));exit;
        }
        $join=[
        	['__USER__ u','u.id=uc.user_id','LEFT'],
        ];
        $field='u.user_nickname,u.avatar,u.id as uid,u.user_info,u.fans_counts,u.num,uc.to_userid,uc.user_id,uc.id as ucid,uc.fansShow';
        $res = DB::name('user_concern')
        ->alias('uc')
        ->join($join)
        ->Distinct(true) //去重
        ->where('uc.to_userid',$user_id)
        ->where('u.id','neq','')
        ->where('u.id','neq',$user_id)
        ->field($field)
        ->select();

        echo json_encode($res);exit;
	}
	public function attenPerson()
	{
		$user_id = intval($_POST['userid']);
		$fansShow = intval($_POST['fansShow']);
		$my_to_userid = intval($_POST['my_to_userid']);

        if(!$user_id){
            echo json_encode(array("status"=>0,"msg"=>"尚未登录"));exit;
        }
        if(!$my_to_userid){
            echo json_encode(array("status"=>0,"msg"=>"关注失败"));exit;
        }
        if($fansShow == 0){
            $data=[
                'user_id'     =>$user_id,
                'to_userid'   =>$my_to_userid,
                'fansShow'    => 1
            ];
            if(DB::name('user_concern')->where('user_id',$user_id)->where('to_userid',$my_to_userid)->find()){
                echo json_encode(array("status"=>0,"msg"=>"您已经关注了他"));exit;
            }
            $res = DB::name('user_concern')->insert($data);
            if($res){
                //这是用户关注粉丝 更新某个字段的值
                $ress=DB::name('user_concern')
                ->where('user_id',$my_to_userid)
                ->where('to_userid',$user_id)
                ->setField('fansShow',1);
                DB::name('user')->where('id',$my_to_userid)->setInc('fans_counts', 1);
                echo json_encode(array("status"=>1,"msg"=>"关注成功"));exit;
            }else{
                echo json_encode(array("status"=>0,"msg"=>"关注失敗"));exit;
            }
        }elseif($fansShow == 1){
            $res = DB::name('user_concern')->where('user_id',$user_id)->where('to_userid',$my_to_userid)->delete();
            if($res){
                $ress=DB::name('user_concern')
                ->where('user_id',$my_to_userid)
                ->where('to_userid',$user_id)
                ->setField('fansShow',0);
                DB::name('user')->where('id',$my_to_userid)->setDec('fans_counts', 1);
                echo json_encode(array("status"=>1,"msg"=>"取消關注"));exit;
            }else{
                echo json_encode(array("status"=>1,"msg"=>"取消失敗"));exit;
            }
        }
      
	}
}