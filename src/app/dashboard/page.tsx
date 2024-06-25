"use client";
import { Dosis } from "next/font/google";
const dosis = Dosis({ subsets: ["latin"] });
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import OpenAI from "openai";
import { useToast } from "@/components/ui/use-toast";

function Dashboard() {
  const { toast } = useToast();
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  function download() {
    const filePath = "/sampleDoc.png";
    const fileName = "sampleDoc.png"; // The name you want the downloaded file to have.

    // Create a temporary anchor element and trigger the download.
    const link = document.createElement("a");
    link.href = filePath;
    link.setAttribute("download", fileName); // This attribute prompts the file to be downloaded.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function readImages() {
    const file = document.getElementById("picture");

    const selectedFiles = await file?.files;

    if (selectedFiles) {
      const readFile = async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      };

      const readAllFiles = async () => {
        try {
          const promises = Array.from(selectedFiles).map(readFile);
          const results = await Promise.all(promises);

          return results;
        } catch (error) {}
      };

      const ims = await readAllFiles();
      return ims;
    } else {
      return [];
    }
  }

  async function getResponse() {
    setLoading(true);
    const newIm = await readImages(); // Ensure this completes before moving on
    if (newIm.length > 0) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
            You are a medical student. You will be given some images which include this details:
            {
              "Introduction": {
                "Name": "",
                "Age": "",
                "Sex": "",
                "Home Address": "",
                "Current Address": "",
                "How Far for the nearest hospital": "",
                "Any condition related to presenting complaint": ""
              },
              "Presenting Complaint": "",
              "History of Presenting Complaint": {
                "Description of PC (SOCRATES)": "",
                "Other Symptoms related to the PC and Diagnosis": "",
                "Differential Diagnosis": "",
                "Description on differential Diagnosis": "",
                "Risks": "",
                "Probable Complications (IF any)": "",
                "Risk Factors for PC": ""
              },
              "Past Medical History (IF ANY)": {
                "Metabolic Syndromes (IF ANY)": {
                  "Duration": "",
                  "Follow Up": "",
                  "Treatments": "",
                  "Complications": ""
                }
              },
              "Past Surgical History (IF ANY)": "",
              "Allergies": {
                "Drugs": "",
                "Plasters": "",
                "Foods": ""
              },
              "Social History": {
                "Activities of the Day": "",
                "Boarding (house Setup)": "",
                "Care Giver": "",
                "Distance/Depression (mood)": "",
                "Education level": "",
                "Financial Level (Whether stable or not)": "",
                "Gay (Sexual habits)": "",
                "Habits": "",
                "Insight": "",
                "Concerns": "",
                "Expectations": ""
              },
              "Family History": "",
              "Summary": {
                "Introduction": {
                  "Name": "",
                  "Age": "",
                  "Sex": "",
                  "Home Address": "",
                  "Current Address": "",
                  "How Far for the nearest hospital": "",
                  "Any condition related to presenting complaint": ""
                },
                "Positive findings": "",
                "Exclude negative findings": ""
              }
            }
            They are in point format. Extract those data and write detailed patient history report in paragraph format. Add as many details as possible to PC and history of PC.`,
          },
          {
            role: "user",
            content: newIm.map((image) => ({
              type: "image_url",
              image_url: { url: image },
            })),
          },
        ],
        temperature: 1,
        max_tokens: 4095,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
      });

      for await (const chunk of completion) {
        if (typeof chunk.choices[0].delta.content !== "undefined") {
          setText(
            (currentText) => currentText + chunk.choices[0].delta.content
          );
        }
      }
    } else {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description:
          "You should upload at least one image to generate a report.",
      });
      setLoading(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    const initiateCalls = async () => {
      if (loading) {
        setText("");
        await getResponse(); // Ensure getResponse is also awaited if it's async
        setLoading(false);
      }
    };

    initiateCalls();
  }, [loading]);

  return (
    <div className="w-full h-full bg-center bg-no-repeat bg-contain bg-[url('/noteTakingDoc.svg')]">
      <Toaster />
      <div className="mx-5 flex h-full">
        <div className="flex justify-between">
          <div className="text-5xl mt-20 w-6/12">
            <p className={dosis.className}>
              Upload photos of the History Notes to Generate a detailed History
              Report...
            </p>
            <p className="text-sm mt-8 text-red-400">
              *use the format given in the{" "}
              <span
                onClick={() => download()}
                className="underline text-purple-500 cursor-pointer"
              >
                sample document
              </span>{" "}
              when taking the notes.
            </p>
            <div className="grid w-full max-w-sm mt-10 items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" multiple />
            </div>
            {loading ? (
              <Button className="w-40 h-10" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating
              </Button>
            ) : (
              <Button className="w-40 h-10" onClick={() => setLoading(true)}>
                Generate
              </Button>
            )}
          </div>
          <Textarea
            readOnly
            className=" w-5/12 h-5/6 text-black bg-white/80 backdrop-blur-sm"
            value={text}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
