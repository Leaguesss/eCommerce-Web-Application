import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme)=>({

    appBar: {
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      heading: {
        color: 'rgba(0,183,255, 1)',
      },
      image: {
        marginLeft: '15px',
      },

      [theme.breakpoints.down('sm')]: {
        mainContainer: {
          flexDirection: "column-reverse"
        }

      },
      root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          justify: "center",
        },
      },
      paper: {
        borderRadius: 15,
        padding: theme.spacing(2),
        width: '100%',        
      },
      form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      fileInput: {
        
        width: '97%',
        margin: '10px 0',
      },
      buttonSubmit: {
        marginBottom: 10,
      },
      centerAdornment: {
        marginLeft: "40%" 
      },
      centerText: {
        textAlign: "center"            
      },
      dialogmargin: {
        margin: theme.spacing(1),
        
      },

      dialogtextField: {
        width: '100%',
      },
      

      
}));