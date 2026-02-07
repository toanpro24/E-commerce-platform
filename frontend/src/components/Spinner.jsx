import "./Spinner.css";

export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}
