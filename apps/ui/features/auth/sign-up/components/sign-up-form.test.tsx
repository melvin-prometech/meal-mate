import { fireEvent, render, screen } from "@testing-library/react";
import { vi, expect, it } from "vitest";
import { SignUpForm } from "./sign-up-form";

vi.mock("../actions", () => ({
    signUp: async () => ({
        message: "We couldn't create your account. Please try again.",
    })
}));

it("shows an error when sign-up fails", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText("First name"), {
        target: { value: "Bob"},
    });

    fireEvent.change(screen.getByLabelText("Last name"), {
        target: { value: "Henk"},
    });

    fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "meal@example.com"},
    });

    fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "TestingFunction123"},
    });

    fireEvent.click(screen.getByRole("button", {
        name: "Create account"
    }));

    expect(
        await screen.findByText("We couldn't create your account. Please try again.")
    ).toBeTruthy();
});