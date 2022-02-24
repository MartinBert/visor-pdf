import React from "react";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const VisorModal = ({ pdf, visorVisible, setVisorVisible }) => {

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

    const printElementDetails = () => {
        const processedPdf = document.getElementById("pdf").src;
        const blob = new Blob([processedPdf], {type : 'application/pdf'})
        const reader = new FileReader();
        reader.addEventListener("loadend", (e) => {console.log(e.target.result)})
        reader.readAsArrayBuffer(blob)
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
                <embed id="pdf" src={pdf} type="application/pdf" style={{width: '100%', height: '800px'}}/>
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
