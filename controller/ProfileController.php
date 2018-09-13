<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/25
 * Time: 14:23
 */

namespace app\Api\controller;
use cmf\lib\Storage;
use think\Image;
use cmf\controller\UserBaseController;
use app\user\model\UserModel;
use app\user\model\PortalPostModel;     //导入用户添加栏目
use think\Db;
use cmf\lib\Upload;
use think\File;
class ProfileController extends UserBaseController
{
    /**
     * 图片上传
     */

    public function photo()
    {
        $user_id=$_POST['userid'];
        if(!$user_id){
            echo json_encode(array('status'=>0,'err'=>'你没有登录.'));
            exit();
        }

        $file = request()->file('file');
        if($file){
            $info = $file->move(ROOT_PATH . 'public' . DS . 'upload'. '/' .'photo');
            if($info){
                $result = [
                    'url' =>  __PHOTOURL__.date('Ymd').'/'.$info->getFilename() //视频地址[__VIDEOURL__]
                ];
                if($result === false){
                    echo json_encode(array('status'=>0,'msg'=>'上传失败.'));
                    exit();
                }else{
                    echo json_encode(array('status'=>1,'msg'=>'上传成功.','code'=>$result['url']));
                    exit();
                }
            }else{
                // 上传失败获取错误信息
                echo json_encode(array('status'=>0,'msg'=>'文件类型错误.'));
                exit();
            }
        }
    }

    /**
     * 视频上传
     */
    public function video()
    {
        $file = request()->file('file');
        if($file){
            $info = $file->move(ROOT_PATH . 'public' . DS . 'upload'. '/' .'video');
            if($info){
                $result = [
                    'url' => __VIDEOURL__.date('Ymd').'/'.$info->getFilename() //视频地址[__VIDEOURL__]
                ];
                if($result === false){
                    echo json_encode(array('status'=>0,'msg'=>'上传失败.'));
                    exit();
                }else{
                    echo json_encode(array('status'=>1,'msg'=>'上传成功.',"code"=>$result['url']));
                    exit();
                }
            }else{
                // 上传失败获取错误信息
                echo json_encode(array('status'=>0,'msg'=>'文件类型错误.'));
                exit();
            }
        }
    }

    /**
     * 确认提交
     */

    public function addPost()
    {
        //所属用户ID
        $userId=(int)$_POST['userid'];
        if(!$userId){
            echo json_encode(array('status'=>0,'msg'=>'你还没有登录！'));exit;
        }
        if($_POST['checkbox'] == ''){
            echo json_encode(array('status'=>0,'msg'=>'请选择发表栏目~'));exit;
        }
        $image = array();
        if(!empty($_POST['tempFile'])){
            $img = explode(',',$_POST['tempFile']);
            foreach ($img as $k => $v) {
                if(preg_match('/(http:\/\/)|(https:\/\/)/i',$v)){
                    $image[$k]['url']=$v;
                }else{
                    $img1=explode("/upload/",$v);
                    $image[$k]['url']=__DATAURL__.$img1[1];
                }
                $name1=explode("/upload/",$v);
                $name2=explode("/",$name1[1]);
                $image[$k]['name']=$name2[2];
            }
            $image = json_encode($image);
        }else{
            $image = "";
        }
        $data = [
            "user_id"         =>$userId,
            "post_desc"       =>urlencode(trim($_POST['post_desc'])),
            "thumbnail"       =>$image,
            "post_content"    =>$_POST['src'],
            "cate_id"         =>$_POST['checkbox'],
            "radio_group"     =>$_POST['radio_group'],
            "published_time"  =>time(),
            "post_status"     => 1,
            "recommended"     => 1
        ];
        
        $res = DB::name('portal_post')->insert($data);
        if($res){
            //统计用户发布的作品
            DB::name('user')->where('id',$userId)->setInc('num', 1);
            echo json_encode(array("status"=>1,"msg"=>'发布成功'));exit;
        }else{
            echo json_encode(array("status"=>0,'msg'=>"发布失败"));exit;
        }
    }

    /**
     * 多图提交
     */
    public function done()
    {
        $user_id = intval($_POST['userid']);
        if (!$user_id) {
            echo json_encode(array('status'=>0,'msg'=>'登录状态异常.'));
            exit();
        }
        //多图存储 记录方式为url,其中name是图片名称
        $image=array();
        if(!empty($_POST['image'])){
            //{"url":"http:\/\/127.0.0.1\/dyxcx\/public\/upload\/default\/20180728\/60da1053c6127f54fee5498a7e7557c5.jpg","name":"60da1053c6127f54fee5498a7e7557c5.jpg"}
            $img = explode(',',$_POST['image']);
            foreach ($img as $k => $v) {
                if(preg_match('/(http:\/\/)|(https:\/\/)/i',$v)){
                    $image[$k]['url']=$v;
                }else{
                    $img1=explode("/upload/",$v);
                    $image[$k]['url']=__DATAURL__.$img1[1];
                }
                $name1=explode("/upload/",$v);
                $name2=explode("/",$name1[1]);
                $image[$k]['name']=$name2[2];
            }
            $image = json_encode($image);
        }else{
            $image = "";
        }
        $data = [
            'user_id' => $user_id,
            'thumbnail' => $image,
            'post_desc' => urlencode(trim($_POST['post_desc'])),
            'published_time'  =>time(),
        ];
        $res = DB::name('portal_post')->insert($data);
        if($res){
            //统计用户发布的作品
            DB::name('user')->where('id',$user_id)->setInc('num', 1);
//            echo json_encode(array('status'=>1,'msg'=>$data));exit; 主要用来支付的$data
            echo json_encode(array('status'=>1,'msg'=>"发布成功"));exit;
        }else{
            echo json_encode(array('status'=>0,'msg'=>"发布失败"));exit;
        }
    }


    /**
     * 微信支付接口
     */
    public function pay($params)
    {
        $return = $this->weixinapp(json_decode($params));
        return $return;
    }
    /**
     * 微信支付完成，回调url地址
     */
    public function payResult()
    {
        $post = file_get_contents('php://input');    //接受POST数据
        $post_data = $this->xmlToArray($post);   //微信支付成功，返回回调地址url的数据：XML转数组Array
        $postSign = $post_data['sign'];
        unset($post_data['sign']);
    }

}