import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import { PDFDocument } from "pdf-lib";
import AWS from "aws-sdk";
import AmazonS3URI from "amazon-s3-uri";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const VisorModal = ({ pdf, visorVisible, setVisorVisible }) => {
  const [pdfLocalUrl, setPdfLocalUrl] = useState(null);
  const [createdBlob, setCreatedBlob] = useState(null);

  useEffect(() => {
    if (!pdf) return;
    const loadPdfInBlob = async () => {
      try{
        const credentials = await new AWS.Credentials(
          process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
          null
        );
        AWS.config.update({
          credentials,
          region: "us-east-2",
        });
        const s3 = new AWS.S3();
        const { bucket, key } = AmazonS3URI(pdf);
        s3.getObject(
          { Bucket: bucket, Key: key.replaceAll("+", " ") },
          (error, item) => {
            if (error) {
              console.log(error);
            } else {
              const arrayBuffer = item.Body;
              const blob = new Blob([arrayBuffer], { type: "application/pdf" });
              setCreatedBlob(blob);
              const pdfUrl = URL.createObjectURL(blob);
              setPdfLocalUrl(pdfUrl);
            }
          }
        );
      }catch(e){
        console.log("Url inválida");
      }
    };
    loadPdfInBlob();
  }, [pdf]);

  const printElementDetails = () => {
    //Utilicé el Blob instanciado luego de recuperar la información del pdf de Amazon.
    printFromStoragedBlob();

    //Intenté hacer un fetch a la url del Blob para ver si "refrescaba" los cambios del usuario sobre el pdf, pero no resultó.
    retryFetchBlobData();
  };

  const printFromStoragedBlob = async () => {
    const blob1 = await createdBlob.arrayBuffer();
    const doc1 = await PDFDocument.load(blob1);
    const form1 = await doc1.getForm();
    const fields1 = await form1.getFields();
    console.log(fields1);
  };

  const retryFetchBlobData = async () => {
    const blob2 = await fetch(pdfLocalUrl).then((res) => res.blob());
    const arrayBufferOfPdf = await blob2.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBufferOfPdf);
    const form2 = await pdfDoc.getForm();
    const fields2 = await form2.getFields();
    console.log(fields2);
  };

  return (
    <>
      <Modal
        open={visorVisible}
        onClose={() => {
          setVisorVisible(false);
        }}
      >
        <Box sx={style}>
          <Grid>
            <Grid item xs={12}>
              {pdfLocalUrl ? (
                <embed
                  id="pdf"
                  src={pdfLocalUrl}
                  type="application/pdf"
                  style={{ width: "100%", height: "800px" }}
                />
              ) : (
                <CircularProgress/>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => {
                  printElementDetails();
                }}
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
