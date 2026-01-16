import axios from "axios";
import { CHOSEN_LANGUAGES } from "./piston";

async function seedData() {
  try {
    const runtimes: any[] = CHOSEN_LANGUAGES;
    for (const runtime of runtimes) {
      console.log(runtime);
      // Send runtime info to your local server
      if (runtime.installed) {
        console.log("package already installed");
        continue;
      }
      try {
        await axios.post(
          process.env.CODE_EXECUTION_SERVER! + "/api/v2/packages",
          {
            language: runtime.language,
            version: runtime.language_version,
          }
        );
      } catch (error: any) {
        console.log(error.message);
      }
    }
  } catch (error: any) {
    console.error("An error occurred:", error.message);
    console.log(error);
  }
}

seedData();
