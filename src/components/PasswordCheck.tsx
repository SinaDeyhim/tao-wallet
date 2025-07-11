interface PasswordChecklistProps {
  password: string;
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({
  password,
}) => {
  return (
    <div className="text-xs text-gray-400 mt-2 space-y-1 flex flex-col items-start">
      <p>Password requirements:</p>
      <ul className="list-disc list-inside ml-4 items-start flex flex-col">
        <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>
          At least one uppercase letter
        </li>
        <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>
          At least one lowercase letter
        </li>
        <li className={/\d/.test(password) ? "text-green-400" : ""}>
          At least one number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : ""}>
          At least one special character
        </li>
        <li className={password.length >= 8 ? "text-green-400" : ""}>
          Minimum 8 characters
        </li>
      </ul>
    </div>
  );
};
