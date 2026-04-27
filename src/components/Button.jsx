// Reusable button component with different styles
function Button({ text, variant = "primary", style, onClick, disabled = false }) {
  // Button style variants
  const classes = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    purple: "btn-purple",
    purpleDisabled: "btn-purple-disabled",
  };

  // Render button
  return (
    <button
      className={classes[variant]}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;