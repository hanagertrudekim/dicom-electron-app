import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DoneIcon from '@mui/icons-material/Done';
import * as S from './MainForm.styled';

function MainForm() {
  const [filePath, setFilePath] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  function selectFolder() {
    window.electron.ipcRenderer.sendMessage('ipc-dicom');

    // main ipc에서 응답 받기
    window.electron.ipcRenderer.on('ipc-dicom-reply', (arg: any) => {
      setFilePath(arg);
    });
  }

  const clickBtn = (e: any) => {
    e.preventDefault();

    setStatus('loading');

    // main ipc 실행
    window.electron.ipcRenderer.sendMessage('ipc-form');

    // main ipc에서 응답 받기
    window.electron.ipcRenderer.on('ipc-form-reply', (arg: any) => {
      setMessage(arg.message);
      if (arg.code === 0) {
        setStatus('success');
      } else if (arg.code === 1) {
        setStatus('error');
      }
    });
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            SNU-H
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, width: '50vw' }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{ 'margin-bottom': '120px' }}
        >
          DICOM Form
        </Typography>

        <form onSubmit={clickBtn}>
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={() => selectFolder()}
          >
            Select Folder
          </Button>
          <S.FileText>
            {filePath && <FolderOpenOutlinedIcon />}
            {filePath}
          </S.FileText>
          <Grid container>
            <S.CompleteText>
              {status === 'success' && <DoneIcon color="success" />}
              {status === 'error' && <WarningAmberOutlinedIcon color="error" />}
              {message}
            </S.CompleteText>
            {status === 'loading' ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                sx={{
                  mt: 3,
                  ml: 1,
                  display: 'absolute',
                  marginLeft: 'auto',
                  marginTop: '60px',
                }}
              >
                progress
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  ml: 1,
                  display: 'absolute',
                  marginLeft: 'auto',
                  marginTop: '60px',
                }}
              >
                submit
              </Button>
            )}
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default MainForm;
