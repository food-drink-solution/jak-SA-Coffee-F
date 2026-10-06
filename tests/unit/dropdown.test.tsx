import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "@/components/ui/dropdown";
import { useState } from "react";

const options = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function Controlled() {
  const [value, setValue] = useState("default");
  return <Dropdown label="Sort by" value={value} options={options} onChange={setValue} />;
}

describe("Dropdown", () => {
  it("shows the selected option on the trigger", () => {
    render(<Dropdown label="Sort by" value="price-asc" options={options} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Sort by: Price: low to high" })).toBeInTheDocument();
  });

  it("opens the listbox and selects an option on click", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Price: high to low" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort by: Price: high to low" })).toBeInTheDocument();
  });

  it("marks the selected option with aria-selected", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("option", { name: "Default" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Price: low to high" })).toHaveAttribute("aria-selected", "false");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("selects via keyboard", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("button", { name: "Sort by: Price: low to high" })).toBeInTheDocument();
  });

  it("calls onChange with the chosen value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown label="Sort by" value="default" options={options} onChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Price: low to high" }));
    expect(onChange).toHaveBeenCalledWith("price-asc");
  });
});
