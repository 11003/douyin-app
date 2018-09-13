<?php
namespace app\Api\controller;

use cmf\controller\HomeBaseController;
use think\Db;
class IndexController extends HomeBaseController
{

    public function index()
    {

        //所属用户ID
        $field='
        a.id as arid,a.post_content,a.post_like,a.thumbnail,a.post_favorites,a.comment_count,a.post_desc,a.user_id,
        u.id,u.avatar,u.user_nickname
        ';
        $join=[
            ['__USER__ u','u.id=a.user_id','LEFT'],
        ];
        $res = DB::name('portal_post')
        ->alias('a')
        ->Distinct(true) //去重
        ->join($join)
        ->where('recommended',1)
        ->where('post_status',1)
        ->order('published_time DESC')
        ->field($field)
        ->select();
        $arr = array();
        foreach ($res as $k => $v) {
            $v['post_desc']=urldecode(trim($v['post_desc']));
            $arr[]=$v;
        }
        echo json_encode($arr);exit;
    }
    //点赞、收藏图标高亮
    public function zan()
    {
        if($_POST['icons']==1){
            $user_id = $_POST['userid'];
            $arid = $_POST['arid'];
            $Zanres = DB::name('user_like')->alias('ul')->where('ul.user_id',$user_id)->where('ul.arid',$arid)->select();
            echo json_encode($Zanres);exit;
        }elseif($_POST['icons']==2){
            $user_id = $_POST['userid'];
            $arid = $_POST['arid'];
            $Shoures = DB::name('user_favorite')->alias('uf')->where('uf.user_id',$user_id)->where('uf.object_id',$arid)->select();
            echo json_encode($Shoures);exit;
        }

    }
    //点赞喜欢
    public function tolike()
    {
        //如果love=1就为0，否则相反
        $url = $_POST['url'];
        $arid = $_POST['arid']; 
        $LoginUserid = $_POST['LoginUserid'];
        $user_id = $_POST['user_id'];
        $love = $_POST['love'];
        if($love == 0){
            if(DB::name('user_like')->where('arid',$arid)->where('user_id',$LoginUserid)->find()){echo json_encode(array("status"=>0,"msg"=>"你已经点过赞了!"));exit;}
            $data=[
                'user_id'     => $LoginUserid,
                'url'         => $url,
                'arid'        => $arid,
                'create_time' =>time(),
                'love'        =>1
            ];
            //用户喜爱表
            DB::name('user_like')->insert($data);

            //每个视频获得的赞
            DB::name('portal_post')
            ->field('post_content,post_like')
            ->where('post_content',$url)
            ->where('id',$arid)
            ->setInc('post_like',1);
            //同时给用户也获赞
            DB::name('user')->where('id',$user_id)->setInc('receive_like_counts', 1);
            echo json_encode(array("status"=>1,"msg"=>"赞好啦!"));exit;
        }elseif($love == 1){

            DB::name('user_like')
            ->where('user_id',$LoginUserid)
            ->where('arid',$arid)
            ->delete();

            //每个视频获得的赞(取消)
            DB::name('portal_post')
            ->field('post_content,post_like')
            ->where('post_content',$url)
            ->where('id',$arid)
            ->where('post_like>0')
            ->setDec('post_like',1);
            //同时给用户也取消赞
            DB::name('user')->where('id',$user_id)->setDec('receive_like_counts', 1);
            echo json_encode(array("status"=>0,"msg"=>"取消点赞"));exit;
        }

    }
    //收藏状态
    public function toCollect()
    {
        $LoginUserid=$_POST['LoginUserid'];
        $url=$_POST['url'];
        $arid=$_POST['arid'];
        $thumbnail=$_POST['thumbnail'];
        $user_id=$_POST['user_id'];
        $name=$_POST['name'];
        $collectShow=$_POST['collectShow'];

        if($collectShow == 0){
            if(DB::name('user_favorite')->where('object_id',$arid)->where('user_id',$LoginUserid)->find()){echo json_encode(array("status"=>0,"msg"=>"你已经收藏了!"));exit;}
            $data=[
                'user_id'             =>$LoginUserid,
                'url'                 =>$url,
                'object_id'           =>$arid,
                'thumbnail'           =>$thumbnail,
                'owner_user_nickname' =>$name,
                'owner_user_id'       =>$user_id,
                'create_time'         =>time(),
                'collectShow'         =>1
            ];
            //用户收藏表
            DB::name('user_favorite')->insert($data);

            //每个视频获得的收藏
            DB::name('portal_post')
            ->field('post_content,post_favorites')
            ->where('post_content',$url)
            ->where('id',$arid)
            ->setInc('post_favorites',1);

            echo json_encode(array("status"=>1,"msg"=>"收藏成功!"));exit;
        }elseif($collectShow == 1){
            DB::name('user_favorite')
            ->where('user_id',$LoginUserid)
            ->where('object_id',$arid)
            ->delete();

            //每个视频获得的收藏(取消)
            DB::name('portal_post')
            ->field('post_content,post_favorites')
            ->where('post_content',$url)
            ->where('id',$arid)
            ->where('post_favorites>0')
            ->setDec('post_favorites',1);
            echo json_encode(array("status"=>0,"msg"=>"收藏取消!"));exit;
        }
    }

    /**
     * 视频播放次数接口
     * @return setInc 自增
     */
    public function setinc()
    {
        $url = $_POST['url'];
        DB::name('portal_post')->field('post_content,num')->where('post_content',$url)->setInc('num',1);
    }

   
}