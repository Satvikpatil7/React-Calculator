import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { evaluate } from "mathjs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLDivElement>(null);

  const isOperator = useCallback((char: string) => /[+\-*/]/.test(char), []);

  const safeEvaluate = useCallback((expression: string): string => {
    // Prevent evaluation if empty or ending with an operator
    if (!expression || /[+\-*/]$/.test(expression)) {
      return "Error";
    }

    try {
      console.log("Evaluating expression:", expression);
      const sanitizedExpression = expression.replace(/%/g, "/100*"); // Convert % to valid math
      const result = evaluate(sanitizedExpression);
      console.log("Evaluation result:", result);
      return result.toString();
    } catch (err) {
      console.log("Error in evaluation:", err);
      return "Error";
    }
  }, []);

  const handleEvaluate = useCallback(() => {
    setInput((prev) => safeEvaluate(prev));
  }, [safeEvaluate]);

  // Handles button clicks using event delegation
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (!target || target.tagName !== "BUTTON") return; // Ignore non-button clicks

      const value = target.innerText;
      console.log("Button clicked:", value);

      if (value === "C") {
        setInput("");
      } else if (value === "=") {
        handleEvaluate();
      } else {
        setInput((prev) => {
          // Prevent consecutive operators
          if ((isOperator(value) && prev === "") || (isOperator(value) && isOperator(prev.slice(-1)))) {
            return prev;
          }
          return prev + value;
        });
      }
    },
    [handleEvaluate, isOperator]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log("Key pressed:", event.key);
      const { key } = event;

      if (/[0-9.+\-*/%]/.test(key)) {
        setInput((prev) => prev + key);
      } else if (key === "Enter") {
        handleEvaluate();
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
    },
    [handleEvaluate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  

  const buttonValues = useMemo(
    () => ["C", "%", "/", "9", "8", "*", "7", "6", "-", "5", "4", "+", "3", "2", ".", "1", "0", "="],
    []
  );

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

        {/* Attach onClick to parent Grid container for event delegation */}
        <Grid container spacing={1} justifyContent="center" onClick={handleClick}>
          {buttonValues.map((value) => (
            <Grid item xs={4} key={value}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  height: "50px",
                  fontSize: "1.2rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                }}
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
