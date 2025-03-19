import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLDivElement>(null);

  const safeEvaluate = useCallback((expression: string): string => {
    try {
      console.log("Evaluating expression:", expression);
      const sanitizedExpression = expression.replace(/x/g, "*").replace(/%/g, "/100*");
      const result = new Function(`return ${sanitizedExpression}`)().toString();
      console.log("Evaluation result:", result);
      return result;
    } catch {
      console.log("Error in evaluation");
      return "Error";
    }
  }, []);

  const isOperator = useCallback((char: string) => {
    console.log("Checking if operator:", char);
    return /[+\-*/]/.test(char);
  }, []);

  const handleClick = useCallback((value: string) => {
    console.log("Button clicked:", value);
    if (value === "C") {
      setInput("");
      console.log("Cleared input");
    } else if (value === "=") {
      setInput(safeEvaluate(input));
    } else {
      setInput((prev) => {
        if ((isOperator(value) && prev === "") || (isOperator(value) && isOperator(prev.slice(-1)))) {
          console.log("Preventing consecutive operators");
          return prev;
        }
        console.log("New input:", prev + value);
        return prev + value;
      });
    }
  }, [input, safeEvaluate, isOperator]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    console.log("Key pressed:", event.key);
    const { key } = event;
    if (/[0-9.+\-*/%]/.test(key)) {
      handleClick(key);
    } else if (key === "Enter") {
      handleClick("=");
    } else if (key === "Backspace") {
      setInput((prev) => {
        console.log("Backspace pressed, new input:", prev.slice(0, -1));
        return prev.slice(0, -1);
      });
    }
  }, [handleClick]);

  useEffect(() => {
    console.log("Adding event listener for keydown");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      console.log("Removing event listener for keydown");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    console.log("Input changed:", input);
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [input]);

  const buttonValues = useMemo(() => [
    "C", "%", "/", "9", "8", "7",
    "6", "5", "4", "3", "2", "1",
    "0", ".", "x", "-", "+", "="
  ], []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Typography variant="h2" color="primary" gutterBottom>
        Calculator
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          width: "320px",
          backgroundColor: "white",
        }}
      >
        <Box
          ref={inputRef}
          sx={{
            width: "100%",
            mb: 2,
            p: 1,
            textAlign: "right",
            fontSize: "1.5rem",
            fontWeight: "bold",
            backgroundColor: "#eee",
            borderRadius: "4px",
            minHeight: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {input || "0"}
        </Box>
        <Grid container spacing={1} justifyContent="center">
          {buttonValues.map((value) => (
            <Grid item xs={4} key={value}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleClick(value)}
                sx={{ height: "50px", fontSize: "1.2rem", backgroundColor: "#1976d2", color: "white" }}
              >
                {value}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default App;