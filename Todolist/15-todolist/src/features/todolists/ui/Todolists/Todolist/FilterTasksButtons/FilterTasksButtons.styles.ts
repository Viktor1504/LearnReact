import { SxProps } from "@mui/material"

export const filterButtonsContainerSx = (disabled: boolean = false): SxProps => ({
  display: "flex",
  justifyContent: "space-between",
  pointerEvents: disabled ? "none" : "auto",
  opacity: disabled ? 0.5 : 1,
})
