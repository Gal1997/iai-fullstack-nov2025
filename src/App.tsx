import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

import { useState } from 'react'
import { type ConfigType } from './types/config'
import { useForm } from "react-hook-form";

import { Button, Snackbar } from '@mui/material';
import defaultConfig from './utils/defaultConfig';
import formatData from './utils/formatData';
import ConfigAccordion from './ConfigAccordion';

import { getConfig, saveConfig, removeConfig } from './services/configService';
import { downloadConfig } from './utils/downloadConfig';


function App() {
  /* We use react-hook-form to manage our data, so here we create our initial useForm
     and also fill it with data from localStorage OR from default config in case there is no data in localStorage
     control : connects MUI components to react-hook-form
     handleSubmit: validates according to the rules we set
     reset: clear the entire form (we also send this function defaultConfig so it will reset to that)
     getValues : gives us the current form state
     */

  const { control, handleSubmit, reset, getValues } = useForm<ConfigType>({
    defaultValues: getConfig()
  });


  const [snackbar, setSnackbar] = useState<string | null>(null);  // This will hold the message shown in the pop-up 'snackbar' from MUI, at the bottom left of the screen
  const [VDDenabled, setVDDenabled] = useState(false);  // This sets if user wants VDD included in the JSON or not



  const handleSave = (data: ConfigType) => {
    const formattedData = formatData(data, VDDenabled);
    saveConfig(formattedData)
    setSnackbar('Config saved!');
  };

  const handleReset = () => {
    const confirmed = window.confirm("Are you sure you want to reset the config?");
    if (confirmed) {
      removeConfig();
      reset(defaultConfig); // We use the built-in reset function given to us by react hook form
      setSnackbar('Config reset');
    }
  };

  const handleDownload = () => {
    const currentData = getValues();
    const formattedData = formatData(currentData, VDDenabled);
    downloadConfig(formattedData) // this method was created with the help of chatgpt
    setSnackbar('Download started');
  };




  return (
    <div>
      <h1 className='title'>Gal's Config Manager</h1>


      {/* ConfigAccordion contains all the Accordion sections and the ControlledField factory */}
      <div className='accordion_container'><ConfigAccordion
        control={control}
        VDDenabled={VDDenabled}
        setVDDenabled={setVDDenabled}
      />
      </div>
      <div className='buttons_container'>
        {/* Because save/download runs handleSubmit before themselves, react-hook-form will validate
        the fields according to the rules we set, and will only call handleSave/handleSubmit IF validation passes! */}
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit(handleSave)} sx={{ textTransform: 'none' }}>Save</Button>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleSubmit(handleDownload)} sx={{ textTransform: 'none' }}>Download</Button>
        <Button variant="contained" startIcon={<DeleteIcon />} onClick={handleReset} sx={{ textTransform: 'none', backgroundColor: 'rgba(166,74,74,1)' }}>Reset</Button>
      </div>
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar(null)} message={snackbar} />
    </div>
  )
}

export default App
