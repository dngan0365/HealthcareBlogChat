export default function CustomInput(props) {
    return (
      <div className="mb-4">
        <label
          htmlFor={props.id}
          className="block text-sm font-bold text-gray-700"
        >
          {props.title}
        </label>
        <input
          className={`w-full mt-1 px-3 py-2 border rounded-md text-sm ${
            props.disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white focus:ring focus:ring-blue-300"
          }`}
          id={props.id}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          disabled={props.dis}
          required={props.req}
          type={props.type}
          {...props.inputProps} // For additional props
        />
        {props.content && (
          <div className="text-sm text-gray-500 mt-1">{props.content}</div>
        )}
      </div>
    );
  }
  