import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LandingPage from "./LandingPage";
import * as storage from "@/utils/storage";
import * as passwordUtils from "@/utils/password";
import "@testing-library/jest-dom";

// Mock subcomponents to isolate LandingPage logic
jest.mock("./CreateWallet", () => () => <div>CreateWallet</div>);
jest.mock("./WelcomeScreen", () => (props: any) => (
  <div>
    WelcomeScreen
    <button onClick={props.onCreateWallet}>Create Wallet</button>
    <button onClick={props.onImportWallet}>Import Wallet</button>
  </div>
));
jest.mock("./ImportWallet", () => () => <div>ImportWallet</div>);
jest.mock("./WalletDashboard", () => () => <div>WalletDashboard</div>);

jest.mock("lucide-react", () => ({
  Lock: () => <svg data-testid="lock-icon" />,
}));

beforeEach(() => {
  jest.resetAllMocks();
});

const mockGetFromStorage = jest.spyOn(storage, "getFromStorage");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("LandingPage component", () => {
  test("renders loading state initially", async () => {
    render(<LandingPage />);
    expect(screen.getByText(/loading wallet state/i)).toBeInTheDocument();
  });

  test("renders welcome screen if no wallet data", async () => {
    mockGetFromStorage.mockResolvedValueOnce(null); // view
    mockGetFromStorage.mockResolvedValueOnce(null); // walletData
    mockGetFromStorage.mockResolvedValueOnce(null); // walletLocked

    render(<LandingPage />);
    await waitFor(() =>
      expect(screen.getByText(/WelcomeScreen/i)).toBeInTheDocument()
    );
  });

  test("transitions to create wallet view", async () => {
    mockGetFromStorage.mockResolvedValue(null); // view
    mockGetFromStorage.mockResolvedValue(null); // walletData
    mockGetFromStorage.mockResolvedValue(null); // walletLocked

    render(<LandingPage />);
    await waitFor(() =>
      expect(screen.getByText(/WelcomeScreen/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Create Wallet"));
    expect(screen.getByText(/CreateWallet/i)).toBeInTheDocument();
  });

  test("renders unlock screen when wallet is locked", async () => {
    const fakeWalletData = { address: "0x123", balance: "100" };
    mockGetFromStorage.mockImplementation((key) => {
      if (key === "walletData") return Promise.resolve(fakeWalletData);
      if (key === "walletCurrentView") return Promise.resolve("dashboard");
      if (key === "walletLocked") return Promise.resolve("true");
      return Promise.resolve(null);
    });

    render(<LandingPage />);
    await waitFor(() =>
      expect(screen.getByText(/unlock wallet/i)).toBeInTheDocument()
    );
  });

  test("unlocks wallet with correct password", async () => {
    const fakeWalletData = { address: "0x123", balance: "100" };

    mockGetFromStorage.mockImplementation((key) => {
      if (key === "walletData") return Promise.resolve(fakeWalletData);
      if (key === "walletCurrentView") return Promise.resolve("dashboard");
      if (key === "walletLocked") return Promise.resolve("true");
      if (key === "walletPassword") return Promise.resolve("hashed-pass");
      return Promise.resolve(null);
    });

    jest.spyOn(passwordUtils, "verifyPassword").mockResolvedValueOnce(true); // valid password

    render(<LandingPage />);
    await screen.findByText(/unlock wallet/i);

    const input = screen.getByPlaceholderText(/enter password/i);
    const button = screen.getByRole("button", { name: /unlock/i });

    fireEvent.change(input, { target: { value: "mySecret" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText(/WalletDashboard/i)).toBeInTheDocument()
    );
  });
});
