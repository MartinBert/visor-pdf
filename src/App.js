import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import VisorModal from './components/VisorModal';

const App = () => {
  const [pdf, setPdf] = useState(null);
  const [visorVisible, setVisorVisible] = useState(false);
  const [error, setError] = useState(false);

  const openVisor = () => {
    if(!pdf) return setError(true);
    setVisorVisible(true);
  }

  return (
    <>
      <Grid 
        container 
      >
        {(error) 
        ? 
          <Grid
            item
            xs={12}
            sx={{mt: 20}}
          >
            <Alert 
              severity="error" 
              onClose={() => {setError(false)}}
            >
              Error al abrir el visor, debe ingresar una URL
            </Alert>
          </Grid>
        : null}

        <Grid 
          item 
          xs={12}
          textAlign="center"
          sx={{mt: (error) ? 0 : 20}}
        >
            <TextField 
              id="outlined-disabled" 
              label="Introducir url de pdf"
              sx={{mr: 2, width: 500}}
              size="small"
              onChange={(e) => { 
                setPdf(e.target.value)
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                openVisor()
              }}
            >
              Abrir pdf en visor
            </Button>
        </Grid>
      </Grid>
      <VisorModal
        pdf={pdf}
        visorVisible={visorVisible}
        setVisorVisible={setVisorVisible}
      />
    </>
  );
};

export default App;
