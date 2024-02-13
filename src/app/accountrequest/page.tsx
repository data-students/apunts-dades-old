"use client";
import React, { FC, useState } from "react";
import axios from "axios";
import { Combobox } from "@/components/Combobox";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/checkbox";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const generation = [
    {
      value: "2017",
      label: "2017",
    },
    {
      value: "2018",
      label: "2018",
    },
    {
      value: "2019",
      label: "2019",
    },
    {
      value: "2020",
      label: "2020",
    },
    {
      value: "2021",
      label: "2021",
    },
    {
      value: "2022",
      label: "2022",
    },
    {
      value: "2023",
      label: "2023",
    },
  ];

  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>("");
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!isSelected) {
      toast({
        title: "Accept Privacy and Terms of Service",
        description: "Please accept the privacy and terms of service.",
        variant: "destructive",
      });
      return;
    }

    axios
      .post("/api/accountrequest", { email, selectedYear })
      .then((response) => {
        toast({
          description: `La teva sol·licitud s'ha creat correctament`,
        });
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response.status === 409) {
          // Handle conflict
          toast({
            title: "Ja existeix una sol·licitud amb aquest correu",
            description: (error.response.data as { message: string }).message,
            variant: "destructive",
          });
        } else if (error.response.status === 422) {
          // Handle conflict
          toast({
            title: `${error.response.status} - ${error.response.statusText}`,
            description: (error.response.data as { message: string }).message,
            variant: "destructive",
          });
        }
      });
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="mb-2" style={{ fontSize: "24px" }}>
        <strong>Demana Accés a Apunts Dades</strong>
      </h1>
      <h2 className="mb-2">Mail UPC</h2>
      <Input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <h2 className="mb-2 mt-4">Generació</h2>
      <Combobox
        options={generation}
        value={selectedYear}
        setValue={setSelectedYear}
      />
      <div className="mt-6">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => {
            if (checked === "indeterminate") {
              setIsSelected(false);
            } else {
              setIsSelected(checked);
            }
          }}
          id="terms"
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
        >
          Accept terms and conditions
        </label>
      </div>
      <Button onClick={handleSubmit} className="mt-6">
        Submit
      </Button>
    </div>
  );
};

export default Page;
