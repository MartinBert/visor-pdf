import React, {useState, useEffect} from "react";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { PDFDocument } from 'pdf-lib';
import AWS from 'aws-sdk';
import AmazonS3URI from 'amazon-s3-uri';

const VisorModal = ({ pdf, visorVisible, setVisorVisible }) => {
    const [pdfLocalUrl, setPdfLocalUrl] = useState(null);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1200,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
      if(!pdf) return;
      const loadPdfInBlob = () => {
        AWS.config.update({
          credentials: {
            accessKeyId: 'AKIA22JCCWWQJAB2T3ME',
            secretAccessKey: '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'
          },
          region: 'us-east-2'
        })
        const s3 = new AWS.S3();
        const {bucket, key} = AmazonS3URI(pdf);
        s3.getObject({Bucket: bucket, Key: key.replaceAll('+', ' ')}, (error, item) => {
          if(error){
            console.log(error)
          }else{
            const arrayBuffer = item.Body;
            const blob = new Blob([arrayBuffer], {type: 'application/pdf'});
            const pdfUrl = URL.createObjectURL(blob);
            setPdfLocalUrl(pdfUrl);
          }
        })
      } 
      loadPdfInBlob();
    }, [pdf])

    const printElementDetails = () => {
        
    }

  return (
    <>
      <Modal open={visorVisible} onClose={() => {setVisorVisible(false)}}>
          <Box
            sx={style}
          >
            <Grid>
                <Grid
                    item
                    xs={12}
                >
                  {(pdfLocalUrl) ? <embed id="pdf" src={pdfLocalUrl} type="application/pdf" style={{width: '100%', height: '800px'}}/> : 'Cargando pdf...'}
                </Grid>
                <Grid
                    item
                    xs={12}
                >
                    <Button
                        onClick={() => {printElementDetails()}}
                        variant="contained"
                    >
                        Guardar
                    </Button>
                </Grid>
            </Grid>
          </Box>
      </Modal>
    </>
  );
};

export default VisorModal;
