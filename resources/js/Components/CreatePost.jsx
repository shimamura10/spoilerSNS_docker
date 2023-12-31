import React, {useEffect, useState, useMemo} from "react";
import Post from "@/Components/Post";
import { useForm } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';
import { Link, Card, Typography, Box, Button, ImageList, ImageListItem, TextField, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import axios from "axios";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const CreatePost = (props) => {
    const { categories, auth } = props;
    const {data, setData, post, processing} = useForm({
        user_id: auth.user.id,
        category_id: 0,
        body: "",
        images: undefined,
    })
    
    const handleSendPost = (e) => {
        e.preventDefault();
        post(route("store"), {
            onSuccess: () => window.location.reload(),
        });
        // axios.post(route("store"), data).then((response) => {
        //     window.location.reload();
        // }).catch((error) => {console.log(error);});
    }
    
    const [files, setFiles] = useState([]);
    // const {getRootProps, getInputProps} = useDropzone({
    //     accept: {
    //         'image/*': []
    //     },
    //     onDrop: acceptedFiles => {
    //         setFiles(acceptedFiles.map(file => Object.assign(file, {
    //             image_url: URL.createObjectURL(file)
    //         })));
    //         setData("images", acceptedFiles.map(file => Object.assign(file, {
    //             image_url: URL.createObjectURL(file)
    //         })));
    //     }
    // });
    
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: {'image/*': []},
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                image_url: URL.createObjectURL(file)
            })));
            setData("images", acceptedFiles.map(file => Object.assign(file, {
                image_url: URL.createObjectURL(file)
            })));
        },
        maxFiles:4
    });
    
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);
    
    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
          <div style={thumbInner}>
              <img
                  src={file.image_url}
                  style={img}
                  // Revoke data uri after image is loaded
                  onLoad={() => { URL.revokeObjectURL(file.image_url) }}
              />
          </div>
      </div>
    ));
  
    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.image_url));
    }, []);

    return (
        <Card
            sx={{
                // '& .MuiTextField-root': { m: 1, width: '50ch' },
                '& .MuiFormControl-root': { m: 1, width: '50ch' },
                m:1,
                p:2,
                width:550,
                height:"100%",
            }}
        >
            <Box
                component="form"
                // noValidate
                autoComplete="off"
                onSubmit={handleSendPost}
            >
            <Typography variant="h4" sx={{ m: 1 }}>投稿作成</Typography>
            
            <TextField
                label="本文"
                multiline
                onChange={(e) => setData("body", e.target.value)}
                required
                // {...register('body')}
            />
            
            <FormControl>
                <InputLabel>作品カテゴリー</InputLabel>
                <Select label="作品カテゴリー" 
                    onChange={(e) => setData("category_id", e.target.value)}
                    required
                    // {...register('category_id')}
                >
                    { auth.user.categories.map((category) => (
                        <MenuItem value={ category.id }>{ category.name }</MenuItem>  
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link href={route("category.create")}>作品カテゴリーの新規作成</Link>
            </Box>

            <Box sx={{ m:1 }} component="section" className="container">
                <div {...getRootProps({className: 'dropzone', style})}>
                    <input {...getInputProps()} />
                    <p>クリックもしくは、ドラッグアンドドロップで添付する画像を選択してください</p>
                    <p>ひとつの投稿につき最大4枚まで画像を添付できます</p>
                    {/* <em>(4 files are the maximum number of files you can drop here)</em> */}
                </div>
                {/* <aside style={thumbsContainer}>
                    {thumbs}
                </aside> */}
            </Box>
            
            <ImageList sx={{ width: 482, m:1}} cols={2} variant="quilted" rowWidth={240} rowHeight={135}>
                { files.map((image) => (
                    <ImageListItem key={image.image_url}>
                        <img
                            src={image.image_url}
                            alt="画像が表示できません"
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                <Button variant="contained" type="submit" sx={{ m:1 }} disabled={processing}>送信</Button>
            </Box>
            
            {/* <Post author={auth.user} post={data} comments={0}/> */}
            </Box>
        </Card>
  );
}

export default CreatePost;