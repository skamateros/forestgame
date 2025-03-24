import "./style.css";
import { setupButton } from "./dm.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <div class="text-content">
          <img src="photo1.jpeg"/>
    </div>
    <div>
          <h1>Forest Escape</h1>
    <p>Welcome to Forest Escape!</p>
    <p>To start, simply click on the button below.</p>
    <p>If at any point you're stuck on what to do,</p>
    <p>simply ask "What can I do?"</p>
    <button id="counter" type="button"></button>
    </div>
          <img src="photo2.jpeg"/>

  </div>
`;

setupButton(document.querySelector<HTMLButtonElement>("#counter")!);
