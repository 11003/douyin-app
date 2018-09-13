<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/18
 * Time: 18:00
 */

namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use app\portal\model\PortalTagModel;
use think\Db;
class MessageController extends HomeBaseController
{
    //用户给我评价作品
    public function comment()
    {
        $user_id = $_POST['userid'];
        if(!$user_id){
            echo json_encode(array("status"=>0,"arr"=>"尚未登录"));exit;
        }
        $join=[
            ['__USER__ u','u.id=c.user_id','LEFT'],
            ['__PORTAL_POST__ a','a.id=c.object_id'],
        ];
        $field = 'u.avatar,u.user_nickname,a.id as arid,a.thumbnail,c.to_user_id,c.create_time,c.content';
        $res = DB::name('comment')->alias('c')->join($join)->where('c.to_user_id',$user_id)->field($field)->select();
        $arr = array();
        foreach ($res as $key => $v) {
            $v['create_time']=date("Y-m-d",$v['create_time']);
            $arr[]=$v;
        }
        echo json_encode($arr);exit;
    }
    //消息通知
    public function info()
    {
        $voice = $_POST['voice'];
        if($voice == 1){
            $res=DB::name('portal_page')
            ->order('published_time DESC')
            ->where('status',1)
            ->where('is_top',1)
            ->field('post_content,published_time')
            ->limit(1)
            ->select();
            $arr = array();
            foreach ($res as $k => $v) {
                $arr['post_content'][]=$v['post_content'];
                $arr['published_time'][]=$v['published_time'];
            }
            echo json_encode($arr);exit;
        }else{
            $messages=DB::name('portal_page')->order('published_time DESC')->where('status',1)->select();
            //提取出时间戳
            $arr=array();
            foreach($messages as $k => $v){
                $v['published_time']=date("Y-m-d H:i",$v['published_time']);
                $arr[]=$v;
            }
            echo json_encode($arr);exit;
        }
    }
    //用户给我点赞
    public function love()
    {
        $user_id = $_POST['userid'];
        if(!$user_id){
            echo json_encode(array("status"=>0,"arr"=>"尚未登录"));exit;
        }
        $join = [
            ['__USER__ u','u.id=cl.user_id','LEFT'],
            ['__COMMENT__ c','c.id=cl.comment_id','LEFT']
        ];
        $field='u.avatar,u.user_nickname,u.id as uid,c.id as cid,cl.create_time,cl.to_user_id';
        $res = DB::name('comment_like')->alias('cl')->join($join)->field($field)->where('cl.to_user_id',$user_id)->select();
        $arr = [];
        foreach ($res as $key => $v) {
            $v['create_time']=date("Y-m-d H:i",$v['create_time']);
            $arr[]=$v;
        }
        echo json_encode($arr);exit;
    }
    
    //标签展示
    public function label()
    {
        $user_id = $_POST['userid'];
        if(!$user_id){
            echo json_encode(array("status"=>0,"arr"=>"尚未登录"));exit;
        }
        $label=DB::name('portal_tag')->order('sort DESC')->where('status',1)->where('user_id',$user_id)->select();
        echo json_encode($label);exit;
    }
    public function labellimit()
    {
        $user_id = $_POST['userid'];
        if(!$user_id){
            echo json_encode(array("status"=>0,"arr"=>"尚未登录"));exit;
        }
        $label=DB::name('portal_tag')->order('create_time DESC')->where('status',1)->where('user_id',$user_id)->field('name')->limit(5)->select();
        echo json_encode($label);exit;
    }

    //用户添加标签
    public function addlabel()
    {
        $userId=(int)$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $data = [
            "user_id"         =>$userId,
            'create_time'     =>time(),
            "name"            =>$_POST['name']
        ];
        $portalTagModel = new PortalTagModel();
        $portalTagModel->isUpdate(false)->allowField(true)->save($data);
        if($portalTagModel){
            echo json_encode(array("status"=>1,"arr"=>"添加成功"));exit;
        }else{
            echo json_encode(array("status"=>0,'arr'=>"添加失败"));exit;
        }
    }
}