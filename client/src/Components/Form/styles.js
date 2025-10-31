import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    maxWidth: 900,
    margin: "0 auto", // center the paper
    width: "100%",
    boxSizing: "border-box",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing(2), // better spacing between children
  },
  /* fileInput usually hides the actual input and shows a button/label instead */
  fileInput: {
    display: "none",
  },
  fileLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1),
    cursor: "pointer",
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    "&:hover": {
      background: theme.palette.action.hover,
    },
  },
  buttonSubmit: {
    marginBottom: theme.spacing(1.25), // ~10px but consistent with theme
    padding: theme.spacing(1, 3),
    textTransform: "none",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  },
  p2mb2: {
    padding: theme.spacing(4), // 2rem ≈ theme.spacing(4)
    marginBottom: theme.spacing(4),
  },
  // responsive helper example
  fullWidthOnMobile: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));
