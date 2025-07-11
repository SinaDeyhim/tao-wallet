import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImportWallet from "./ImportWallet";
import * as polkadotCrypto from "@polkadot/util-crypto";
import { Keyring } from "@polkadot/keyring";
import * as passwordUtils from "@/utils/password";
import * as storageUtils from "@/utils/storage";
import "@testing-library/jest-dom";

jest.mock("@polkadot/util-crypto");
jest.mock("@polkadot/keyring");
jest.mock("@/utils/password");
jest.mock("@/utils/storage");

describe("ImportWallet", () => {
  const mockOnBack = jest.fn();
  const mockOnWalletImported = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    (polkadotCrypto.mnemonicValidate as jest.Mock).mockReturnValue(true);

    (Keyring as jest.Mock).mockImplementation(() => ({
      addFromUri: jest.fn().mockReturnValue({ address: "test-address" }),
    }));

    (passwordUtils.hashPassword as jest.Mock).mockResolvedValue("hashed-pwd");
    (storageUtils.setToStorage as jest.Mock).mockResolvedValue(undefined);
  });

  it("renders all inputs and buttons", () => {
    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    expect(
      screen.getByRole("heading", { name: /import wallet/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "seed phrase" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /import wallet/i })
    ).toBeDisabled();
  });

  it("toggles seed phrase blur on eye button click", () => {
    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    const toggleButton = screen.getByRole("button", {
      name: "hide seed phrase",
    });

    const textarea = screen.getByRole("textbox", { name: "seed phrase" });

    // Initial: no blur
    expect(textarea).not.toHaveClass("blur-sm");

    // Click toggle (first time)
    fireEvent.click(toggleButton);
    expect(textarea).toHaveClass("blur-sm");

    // Click toggle (second time)
    fireEvent.click(toggleButton);
    expect(textarea).not.toHaveClass("blur-sm");
  });

  it("toggles password visibility", () => {
    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const togglePasswordBtn = screen.getByRole("button", {
      name: "show password",
    });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(togglePasswordBtn);

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(togglePasswordBtn);

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows error for invalid seed phrase mnemonic", async () => {
    (polkadotCrypto.mnemonicValidate as jest.Mock).mockReturnValue(false);

    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    const seedPhrase = Array(12).fill("word").join(" ");

    fireEvent.change(screen.getByRole("textbox", { name: "seed phrase" }), {
      target: { value: seedPhrase },
    });

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /import wallet/i }));

    expect(await screen.findByText(/invalid seed phrase/i)).toBeInTheDocument();
    expect(mockOnWalletImported).not.toHaveBeenCalled();
  });

  it("calls onWalletImported on successful import", async () => {
    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    const seedPhrase = Array(12).fill("word").join(" ");

    fireEvent.change(screen.getByRole("textbox", { name: "seed phrase" }), {
      target: { value: seedPhrase },
    });

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /import wallet/i }));

    await waitFor(() => {
      expect(mockOnWalletImported).toHaveBeenCalledWith({
        address: "test-address",
        seedPhrase: seedPhrase.toLowerCase(),
        balance: "0.00",
      });
    });
  });

  it("disables inputs and buttons while loading", async () => {
    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    const seedPhraseInput = screen.getByRole("textbox", {
      name: "seed phrase",
    });
    const passwordInput = screen.getByLabelText(/new password/i);
    const importButton = screen.getByRole("button", { name: /import wallet/i });

    fireEvent.change(seedPhraseInput, {
      target: { value: Array(12).fill("word").join(" ") },
    });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Mock hashPassword to delay so loading=true persists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let resolveHash: Function;
    (passwordUtils.hashPassword as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveHash = resolve;
        })
    );

    fireEvent.click(importButton);

    expect(seedPhraseInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(importButton).toBeDisabled();

    // Resolve hash to finish loading
    // @ts-ignore
    resolveHash("hashed-pwd");
    await waitFor(() => {
      expect(importButton).not.toBeDisabled();
    });
  });

  it("calls onBack when back button is clicked", () => {
    render(
      <ImportWallet
        onBack={mockOnBack}
        onWalletImported={mockOnWalletImported}
      />
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });
});
