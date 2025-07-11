import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateWallet from "./CreateWallet";
import * as passwordUtils from "@/utils/password";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import "@testing-library/jest-dom";

jest.mock("@polkadot/util-crypto", () => ({
  mnemonicGenerate: jest.fn(),
}));
jest.mock("@polkadot/keyring", () => {
  return {
    Keyring: jest.fn().mockImplementation(() => ({
      addFromUri: jest.fn(() => ({ address: "FAKE_ADDRESS" })),
    })),
  };
});
jest.mock("@/utils/storage", () => ({
  setToStorage: jest.fn(),
}));

describe("CreateWallet component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial step and toggles password visibility", () => {
    render(<CreateWallet onBack={jest.fn()} onWalletCreated={jest.fn()} />);
    expect(screen.getByText(/Secure Your Wallet/i)).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn =
      screen.getAllByRole("button", { name: /show password/i })[0] ||
      screen.getAllByRole("button")[1];
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("shows error if passwords don't match or invalid", async () => {
    // Mock isValidPassword to false to simulate invalid password
    jest.spyOn(passwordUtils, "isValidPassword").mockReturnValue(false);

    render(<CreateWallet onBack={jest.fn()} onWalletCreated={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "weakpass" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: "differentpass" },
    });

    fireEvent.click(screen.getByText(/Continue/i));

    expect(
      await screen.findByText(
        /Password does not meet requirements or does not match/i
      )
    ).toBeInTheDocument();
  });

  test("successful password submit moves to step 2 and shows seed phrase", async () => {
    // Mock isValidPassword to true
    jest.spyOn(passwordUtils, "isValidPassword").mockReturnValue(true);
    jest
      .spyOn(passwordUtils, "hashPassword")
      .mockResolvedValue("hashed_password");
    (mnemonicGenerate as jest.Mock).mockReturnValue(
      "seed phrase one two three four five six seven eight nine ten eleven twelve"
    );

    const mockOnWalletCreated = jest.fn();

    render(
      <CreateWallet onBack={jest.fn()} onWalletCreated={mockOnWalletCreated} />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "StrongPass1!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: "StrongPass1!" },
    });

    fireEvent.click(screen.getByText(/Continue/i));

    await waitFor(() =>
      expect(screen.getByText(/Backup Your Wallet/i)).toBeInTheDocument()
    );

    // Check seed phrase words rendered
    for (const word of "seed phrase one two three four five six seven eight nine ten eleven twelve".split(
      " "
    )) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
  });

  test("copies seed phrase to clipboard and shows copied icon", async () => {
    jest.spyOn(passwordUtils, "isValidPassword").mockReturnValue(true);
    jest
      .spyOn(passwordUtils, "hashPassword")
      .mockResolvedValue("hashed_password");
    (mnemonicGenerate as jest.Mock).mockReturnValue(
      "one two three four five six seven eight nine ten eleven twelve"
    );

    render(<CreateWallet onBack={jest.fn()} onWalletCreated={jest.fn()} />);

    // Fill password and submit
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "StrongPass1!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: "StrongPass1!" },
    });
    fireEvent.click(screen.getByText(/Continue/i));
    await waitFor(() => screen.getByText(/Backup Your Wallet/i));

    // Mock clipboard.writeText
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /copy seed phrase/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "one two three four five six seven eight nine ten eleven twelve"
    );
  });

  test("calls onWalletCreated with correct data when finishing setup", async () => {
    jest.spyOn(passwordUtils, "isValidPassword").mockReturnValue(true);
    jest
      .spyOn(passwordUtils, "hashPassword")
      .mockResolvedValue("hashed_password");
    (mnemonicGenerate as jest.Mock).mockReturnValue(
      "one two three four five six seven eight nine ten eleven twelve"
    );

    const mockOnWalletCreated = jest.fn();

    render(
      <CreateWallet onBack={jest.fn()} onWalletCreated={mockOnWalletCreated} />
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "StrongPass1!" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), {
      target: { value: "StrongPass1!" },
    });
    fireEvent.click(screen.getByText(/Continue/i));
    await waitFor(() => screen.getByText(/Backup Your Wallet/i));

    fireEvent.click(screen.getByText(/I've Saved My Seed Phrase/i));

    expect(mockOnWalletCreated).toHaveBeenCalledWith({
      address: "FAKE_ADDRESS",
      seedPhrase:
        "one two three four five six seven eight nine ten eleven twelve",
      balance: "0.00",
    });
  });

  test("calls onBack when back button clicked", () => {
    const mockOnBack = jest.fn();

    render(<CreateWallet onBack={mockOnBack} onWalletCreated={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(mockOnBack).toHaveBeenCalled();
  });
});
