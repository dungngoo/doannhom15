import { Box, Button, CircularProgress, Image, Input, SimpleGrid, Text } from "@chakra-ui/react"
import { useState } from "react";
import { ImImage } from "react-icons/im";
import { useSearchParams } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import useQuery from "../hooks/useMutation";
// import AWS from "aws-sdk";
const validFileTypes = ['image/jpg', 'image/png', 'image/jpeg']
const ServerURL = "http://localhost:9090";
const URL = "/images";
const CLOUD_FRONT_URL = 'https://da48l8u6cc7lx.cloudfront.net';
// var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const ErrorText = ({ children, ...props }) => (
    <Text fontSize="lg" color="red.300" {...props}>
        {children}
    </Text>
);

const Posts = ({ socketRef }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    let chatId = searchParams.get("chatId");
    // const chatId = searchParams.get('chatId');
    // var options = {
    //     headers: {
    //         'chatId': chatId,
    //     }
    // };
    // const {
    //     mutate: uploadImage,
    //     isLoading: uploading,
    //     error: uploadError,

    // } = useMutation({ url: URL})
    // const { data: imagesUrls = [], isLoading: imageLoading, error: fetchError } = useQuery(URL);

    // const [error, setError] = useState('')

    // const handleUpload = async e => {
    //     const file = e.target.files[0];
    //     console.log(e);

    //     if (!validFileTypes.find(type => type === file.type)) {
    //         setError("File must be in JPG/PNG format");
    //         return;
    //     }
    //     const form = new FormData();
    //     form.append('image', file);
    //     await uploadImage(form);
    // };

    // const FetchImage = async e => {
    //     fetch(`${ServerURL}/images`, { method: "POST" }).then((res) => console.log(res)).then(data => {
    //         console.log(data);
    //     })
    // }
    const [selectedImage, setSelectedImage] = useState(null);
    const handleUpload = async e => {
        const file = e.target.files[0];
        const image = file.originalname.split(".");
        const fileType = image[image.length - 1];
        const filePath = `${localStorage.getItem("myid") + Date.now().toString()}.${fileType}`;
        const params = {
            Bucket: "uploads3-toturial-bucket12",
            Key: filePath,
            Body: file.buffer
        }
        // s3.upload(params, (err, data) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         const sendImage = async () => {
        //             if (data !== null) {
        //                 const messageData = {
        //                     type: 1,
        //                     content: `${CLOUD_FRONT_URL}/${filePath}`,
        //                     chatId: chatId,
        //                 };
        //                 await socketRef.current.emit("User-Send-Message", messageData);
        //             }
        //         };
        //         sendImage();
        //     }
        // })
    }
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
        //  {error && (<ErrorText>{error}</ErrorText>)}
        //  {uploadError && (<ErrorText>{uploadError}</ErrorText>)}
        //  {imagesLoading && (
        //      <CircularProgress
        //          color="gray.600"
        //          trackColor="blue.300"
        //          size={7}
        //          thickness={10}
        //          isIndeterminate
        //      />)}
        //  {/* {fetchError && (
        //      <ErrorText textAlign="left">Failed to load images</ErrorText>
        //  )}
        //  {!fetchError && imageUrls?.length === 0 && (
        //      <Text textAlign="left" fontSize="lg" color="gray.500">
        //          No images found
        //      </Text>
        //  )} */}
        //  <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        //      {imageUrls?.length > 0 &&
        //          imageUrls.map(url => (
        //              <Image borderRadius={5} src={url} alt="Image" key={url} />
        //          ))}
        //  </SimpleGrid>
    );
}

export default Posts;