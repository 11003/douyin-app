<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/17
 * Time: 15:21
 */

namespace app\Api\controller;
use app\Api\validate\UserValidate;
use app\user\model\UserModel;
use cmf\controller\HomeBaseController;
use think\Db;
use think\Validate;
class UserController extends HomeBaseController
{

    //查询用户信息
    public function info()
    {
        //所属用户ID
        $userId=intval($_POST['userid']);
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }

        $join = [
            ['__PORTAL_POST__ a','a.user_id=u.id','LEFT']
        ];
        $field = 'u.id,u.sex,u.age,u.user_nickname,u.user_info,u.user_city,u.wx_code,u.avatar,u.receive_like_counts,u.fans_counts,u.follow_counts,a.thumbnail,a.post_content,a.num,a.id as arid';

        $user = DB::name('user')
        ->alias('u')
        ->where('u.id',$userId)
        ->order('a.published_time DESC')
        ->join($join)
        ->field($field)
        ->select();


        $arr = array();
        foreach ($user as $k => $v) {
            $arr['id']=$v['id'];
            $arr['num'][]=$v['num'];
            $arr['arid'][]=$v['arid'];
            $arr['user_nickname']=$v['user_nickname'];
            $arr['post_content'][]=$v['post_content'];
            $image = json_decode($v['thumbnail'],true);
            $images = [];
            if(is_array($image)){
                foreach ($image as $key => $val) {
                    $images[$key]=$val['url'];
                }
            }else{
                $arr['thumbnail'][]=$images;
            }
            $arr['thumbnail'][]=$images;
            $arr['user_city']=$v['user_city'];
            $arr['avatar']=$v['avatar'];
            $arr['user_info']=$v['user_info'];
            $arr['sex']=$v['sex'];
            $arr['age']=$v['age'];
            $arr['wx_code']=$v['wx_code'];
            $arr['receive_like_counts']=$v['receive_like_counts'];
            $arr['fans_counts']=$v['fans_counts'];
            $arr['follow_counts']=$v['follow_counts'];
        }
        echo json_encode($arr);exit;
    }
    //用户收藏
    public function UserFavorite()
    {
        $userId=$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $res = DB::name('user_favorite')->where('user_id',$userId)->select();
        echo json_encode($res);exit;
    }
    //用户展示信息
    public function message()
    {
        //所属用户ID
        $userId=$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $field = 'age,avatar,sex,user_provinces,user_citys,user_nickname,balance,user_info,wx_code';
        $user=DB::name('user')->where('id',$userId)->field($field)->find();
        echo json_encode($user);exit;
    }


    //统计用户发布的图片总数
    public function pcount()
    {
        $userid = $_POST['userid'];
        $count = DB::name('portal_post')->where('user_id',$userid)->count('thumbnail');
        echo json_encode($count);exit;
    }
    //统计用户发布的视频总数
    public function vcount()
    {
        $userid = $_POST['userid'];
        $count = DB::name('portal_post')->where('user_id',$userid)->where('thumbnail','NEQ','')->count('post_content');
        echo json_encode($count);exit;
    }
    //用户收藏的视频总数
    public function fcount()
    {
        $userid = $_POST['userid'];
        $count = DB::name('user_favorite')->where('user_id',$userid)->count('id');
        echo json_encode($count);exit;
    }
    
    /**
     * 用户修改信息 (如果用戶更改了頭像并也修改了二維碼才會觸發)
     * public function picFile [二维码]
     * public function headImg [头像]
     */
    public function picFile()
    {
        $userId=(int)$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        if(preg_match('/(http:\/\/)|(https:\/\/)/i', $_POST['picFile'])){
            $picFile=$_POST['picFile'];
        }else{
            $img2=explode("/upload/",$_POST['picFile']);
            $picFile=__DATAURL__.$img2[1];  //http://192.168.0.118/dyxcx/public
        }
        if($_POST['sex'] == '保密'){
            $_POST['sex']=0;
        }elseif($_POST['sex'] == '男'){
            $_POST['sex']=1;
        }else{
            $_POST['sex']=2;
        }
        $data = [
            "user_nickname" => trim($_POST['userName']),
            "sex"           =>$_POST['sex'],
            "age"           =>$_POST['age'],
            "user_info"     =>$_POST['profile'],
            "user_city"     =>$_POST['address'],
            "user_provinces"=>$_POST['province'],
            "user_citys"    =>$_POST['city'],
            "wx_code"       =>$_POST['picFile'] ? $_POST['picFile'] : $picFile,
        ];
        $res = DB::name('user')->where('id',$userId)->update($data);
        if($res){
            echo json_encode(array("status"=>1,"msg"=>"修改成功"));exit;
        }else{
            echo json_encode(array("status"=>0,'msg'=>"修改失败"));exit;
        }
    }
    public function headImg()
    {
        $userId=(int)$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        if(preg_match('/(http:\/\/)|(https:\/\/)/i', $_POST['headImg'])){
            $headimg=$_POST['headImg'];
        }else{
            $img1=explode("/upload/",$_POST['headImg']);
            $headimg=__DATAURL__.$img1[1];  //http://192.168.0.118/dyxcx/public
        }

        if($_POST['sex'] == '保密'){
            $_POST['sex']=0;
        }elseif($_POST['sex'] == '男'){
            $_POST['sex']=1;
        }else{
            $_POST['sex']=2;
        }
        $data = [
            "user_nickname" => trim($_POST['userName']),
            "sex"           =>$_POST['sex'],
            "age"           =>$_POST['age'],
            "user_info"     =>$_POST['profile'],
            "user_city"     =>$_POST['address'],
            "user_provinces"=>$_POST['province'],
            "user_citys"    =>$_POST['city'],
            "avatar"        =>$_POST['headImg'] ? $_POST['headImg'] : $headimg,
        ];
        DB::name('user')->where('id',$userId)->update($data);
    }

    /**
     * 用户修改信息(如果用戶更改了其中一項才會觸發)
     * Img=1 用户只修改了头像
     * Img=2 用户只修改了二维码
     */
    public function edit()
    {
        //用户上传头像
        if($_POST['Img'] == 1){
            $userId=(int)$_POST['userid'];
            if(!$userId){
                echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
            }
            if(preg_match('/(http:\/\/)|(https:\/\/)/i', $_POST['headImg'])){
                $headimg=$_POST['headImg'];
            }else{
                $img1=explode("/upload/",$_POST['headImg']);
                $headimg=__DATAURL__.$img1[1];  //http://192.168.0.118/dyxcx/public
            }

            if($_POST['sex'] == '保密'){
                $_POST['sex']=0;
            }elseif($_POST['sex'] == '男'){
                $_POST['sex']=1;
            }else{
                $_POST['sex']=2;
            }
            $data = [
                "user_nickname" => trim($_POST['userName']),
                "sex"           =>$_POST['sex'],
                "age"           =>$_POST['age'],
                "user_info"     =>$_POST['profile'],
                "user_city"     =>$_POST['address'],
                "user_provinces"=>$_POST['province'],
                "user_citys"    =>$_POST['city'],
                "avatar"        =>$_POST['headImg'] ? $_POST['headImg'] : $headimg,
                "wx_code"       =>$_POST['picUrl']
            ];
            $res = DB::name('user')->where('id',$userId)->update($data);
            if($res){
                echo json_encode(array("status"=>1,"msg"=>"修改成功"));exit;
            }else{
                echo json_encode(array("status"=>0,'msg'=>"修改失败"));exit;
            }
        //上传二维码   
        }elseif($_POST['Img'] == 2){
            $userId=(int)$_POST['userid'];
            if(!$userId){
                echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
            }

            if(preg_match('/(http:\/\/)|(https:\/\/)/i', $_POST['picFile'])){
                $picFile=$_POST['picFile'];
            }else{
                $img2=explode("/upload/",$_POST['picFile']);
                $picFile=__DATAURL__.$img2[1];  //http://192.168.0.118/dyxcx/public
            }
            if($_POST['sex'] == '保密'){
                $_POST['sex']=0;
            }elseif($_POST['sex'] == '男'){
                $_POST['sex']=1;
            }else{
                $_POST['sex']=2;
            }
            $data = [
                "user_nickname" => trim($_POST['userName']),
                "sex"           =>$_POST['sex'],
                "age"           =>$_POST['age'],
                "user_info"     =>$_POST['profile'],
                "user_city"     =>$_POST['address'],
                "user_provinces"=>$_POST['province'],
                "user_citys"    =>$_POST['city'],
                "wx_code"       =>$_POST['picFile'] ? $_POST['picFile'] : $picFile,
                "avatar"        =>$_POST['headUrl']
            ];
            $res = DB::name('user')->where('id',$userId)->update($data);
            if($res){
                echo json_encode(array("status"=>1,"msg"=>"修改成功"));exit;
            }else{
                echo json_encode(array("status"=>0,'msg'=>"修改失败"));exit;
            }
        } 
    }

    /**
     * 用戶只想修改文字信息
     */
    public function editTxt()
    {
        $userId=(int)$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        if($_POST['sex'] == '保密'){
            $_POST['sex']=0;
        }elseif($_POST['sex'] == '男'){
            $_POST['sex']=1;
        }else{
            $_POST['sex']=2;
        }
        $data = [
            "user_nickname" => trim($_POST['userName']),
            "sex"           =>$_POST['sex'],
            "age"           =>$_POST['age'],
            "user_info"     =>$_POST['profile'],
            "user_city"     =>$_POST['address'],
            "user_provinces"=>$_POST['province'],
            "user_citys"    =>$_POST['city'],
            "wx_code"       =>$_POST['picUrl'],
            "avatar"        =>$_POST['headUrl']
        ];
        $res = DB::name('user')->where('id',$userId)->update($data);
        if($res){
            echo json_encode(array("status"=>1,"msg"=>"修改成功"));exit;
        }else{
            echo json_encode(array("status"=>0,'msg'=>"修改失败"));exit;
        }
    }

    //用户关注的人
    public function useratten()
    {
        $userid = intval($_POST['id']);
        if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $join=[
            ['__USER__ u','u.id=uc.to_userid','LEFT'],
        ];
        $field='u.id as uid,u.user_info,u.fans_counts,u.num,uc.to_userid,uc.user_id,uc.id as ucid,uc.fansShow,uc.to_userid';
        $res = DB::name('user_concern')->alias('uc')->join($join)->where('uc.to_userid','neq',$userid)->where('uc.user_id',$userid)->select();
        echo json_encode($res);exit;
    }
    // 用户取消关注
    public function delete()
    {
        $userid = intval($_POST['id']);
        if(!$userid){
            echo json_encode(array('status'=>0,'err'=>'你还没有登录！'));exit;
        }
        $to_userid = intval($_POST['to_userid']);
        $res = DB::name('user_concern')->where('user_id',$userid)->where('to_userid',$to_userid)->delete();
        if($res){
            echo json_encode(array('status'=>1,'msg'=>'您已取消关注'));exit;
        }else{
            echo json_encode(array('status'=>1,'msg'=>'取消关注失败'));exit;
        }
    }

}