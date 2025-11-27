/* eslint-disable @typescript-eslint/no-explicit-any */

import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

import { useState } from 'react'
import { type ConfigType } from '../types/config'
import { useForm } from "react-hook-form";

import { Button, Snackbar } from '@mui/material';
import defaultConfig from '../utils/defaultConfig';
import ConfigAccordion from './ConfigAccordion';


function App() {
  /* We use react-hook-form to manage our data, so here we create our initial useForm
     and also fill it with data from localStorage OR from default config in case there is no data in localStorage
     control : connects MUI components to react-hook-form
     handleSubmit: validates according to the rules we set
     reset: clear the entire form (we also send this function defaultConfig so it will reset to that)
     getValues : gives us the current form state
     */

  const { control, handleSubmit, reset, getValues } = useForm<ConfigType>({
    defaultValues: localStorage.getItem('config')
      ? JSON.parse(localStorage.getItem('config') as string)
      : defaultConfig,
  });


  // This will hold the message shown in the pop-up 'snackbar' from MUI
  const [snackbar, setSnackbar] = useState<string | null>(null);
  // This sets if user wants VDD included in the JSON or not
  const [VDDenabled, setVDDenabled] = useState(false);


  // Save current config to local storage
  const handleSave = (data: ConfigType) => {
    const formattedData = formatData(data);
    localStorage.setItem('config', JSON.stringify(formattedData));
    setSnackbar('Config saved!');
  };


  // Resets the current config + deletes the saved config in local storage 
  const handleReset = () => {
    const confirmed = window.confirm("Are you sure you want to reset the config?");
    if (confirmed) {
      localStorage.removeItem("config");
      reset(defaultConfig); // We use the built-in reset function given to us by react hook form
      setSnackbar('Config reset');
    }
  };


  // Download the config as a JSON file, this method was created with the help of chatgpt
  const handleDownload = () => {
    const currentData = getValues();

    const formattedData = formatData(currentData);

    const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
    setSnackbar('Download started');
  };


  /* This function does
  1) removes vdd from JSON if disabled
  2) Transform recentFixes into string array instead of 1 big string
  3) Format releaseDate to dd/mm/yyyy (Israel standard)
  */
  const formatData = (data: any): ConfigType => {
    // Clone data so we don’t mutate the original form state !!
    // Otherwise we will push an unsupported format to our date picker because we changed data.vdd.releaseDate
    const formatted: any = structuredClone(data)
    if (!VDDenabled) {
      delete formatted.vdd;
    } else if (formatted.vdd) {
      if (formatted.vdd.recentFixes && typeof formatted.vdd.recentFixes === 'string') {
        formatted.vdd.recentFixes = formatted.vdd.recentFixes.split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }
      if (formatted.vdd.releaseDate && typeof formatted.vdd.releaseDate === 'string') {
        const parts = formatted.vdd.releaseDate.split('-');
        if (parts.length === 3) {
          const [year, month, day] = parts;
          formatted.vdd.releaseDate = `${day}/${month}/${year}`;
        } else {
          formatted.vdd.releaseDate = "";
        }
      }

    }

    return formatted;
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
