import PropTypes from "prop-types";

const AuthImagePattern = ({ title, subtitle }) => {
  // Array of pattern components for variety
  const patterns = [
    "rotate-0",
    "-rotate-45",
    "rotate-45",
    "scale-75",
    "scale-90",
    "rotate-90",
    "-rotate-90",
    "scale-110",
    "rotate-180"
  ];

  const shapes = [
    // Circle with inner ring
    <div key="circle" className="w-full h-full relative">
      <div className="absolute inset-2 rounded-full bg-primary/10" />
      <div className="absolute inset-4 rounded-full bg-base-200" />
    </div>,

    // Diamond
    <div key="diamond" className="w-full h-full transform rotate-45">
      <div className="absolute inset-2 bg-primary/10" />
    </div>,

    // Cross pattern
    <div key="cross" className="w-full h-full relative">
      <div className="absolute inset-y-2 left-1/3 right-1/3 bg-primary/10" />
      <div className="absolute inset-x-2 top-1/3 bottom-1/3 bg-primary/10" />
    </div>,

    // Triangle
    <div key="triangle" className="w-full h-full relative overflow-hidden">
      <div className="w-full h-full bg-primary/10 transform rotate-45 scale-150" />
    </div>,

    // Dots pattern
    <div key="dots" className="w-full h-full relative p-2">
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="rounded-full bg-primary/10" />
        <div className="rounded-full bg-primary/10" />
        <div className="rounded-full bg-primary/10" />
        <div className="rounded-full bg-primary/10" />
      </div>
    </div>
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-base-200 relative overflow-hidden transition-transform duration-700 ease-in-out ${
                i % 2 === 0 ? "animate-pulse" : ""
              } ${patterns[i]}`}
            >
              {shapes[i % shapes.length]}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

AuthImagePattern.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default AuthImagePattern;
