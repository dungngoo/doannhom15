import { Box, Button, CircularProgress, Image, Input, SimpleGrid, Text } from "@chakra-ui/react"
import { useState } from "react";
import { ImImage } from "react-icons/im";
import { useSearchParams } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import useQuery from "../hooks/useMutation";
import ReactS3 from 'react-s3';
import { UploadToS3 } from 'react-upload-to-s3'
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
window.Buffer = window.Buffer || require("buffer").Buffer;
const config = {
    bucketName: 'congnghemoi-nhom15-chatapp',
    albumName: 'photos',
    region: 'ap-southeast-1',
    accessKeyId: 'AKIA4SZBYIUOX2L46WOP',
    secretAccessKey: '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',
};

const Posts = ({ socketRef }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    let chatId = searchParams.get("chatId");
    
    const [selectedImage, setSelectedImage] = useState(null);
    const handleUpload = async e => {
        console.log(e.target.files[0]);
       

        ReactS3.uploadFile(e.target.files[0], config)
            .then(async (data) => {
                console.log(data);
                const messageData = {
                    type: 1,
                    content: data.location,
                    chatId: chatId,
                };
                await socketRef.current.emit("User-Send-Message", messageData);
            }).catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            <Input id="imageInput" type="file" name="image" hidden onChange={handleUpload} />
            <Button
                as="label"
                htmlFor="imageInput"
                colorScheme="blue"
                variant="outline"
                mb={4}
                cursor="pointer"
            ><ImImage style={{ height: "40px", width: "20px" }} /></Button>

        </div>
    );
}
export default Posts;