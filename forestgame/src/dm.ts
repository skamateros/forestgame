import { assign, createActor, setup } from "xstate";
import { Settings, speechstate } from "speechstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { KEY, NLU_KEY } from "./azure";
import { DMContext, DMEvents, entities, intents, nluResponse } from "./types";

const inspector = createBrowserInspector();

const azureCredentials = {
  endpoint:
    "https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  key: KEY,
};

const azureLanguageCredentials = {
  endpoint: "https://dialoguesystems.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2024-11-15-preview",
  key: NLU_KEY,
  deploymentName: "forestgame",
  projectName: "forestgame",
};

const settings: Settings = {
  azureLanguageCredentials: azureLanguageCredentials,
  azureCredentials: azureCredentials,
  azureRegion: "northeurope",
  asrDefaultCompleteTimeout: 0,
  asrDefaultNoInputTimeout: 5000,
  locale: "en-US",
  ttsDefaultVoice: "en-US-JennyNeural",
};

const dmMachine = setup({
  types: {
    context: {} as DMContext,
    events: {} as DMEvents,
  },
  actions: {
    "spst.speak": ({ context }, params: { utterance: string }) =>
      context.spstRef.send({
        type: "SPEAK",
        value: { utterance: params.utterance },
      }),
    "spst.listen": ({ context }) =>
      context.spstRef.send({
        type: "LISTEN",
        value: { nlu: true }
      }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBECyA6ACgJzABwENcBiAQQGUAlAFWvIH1KBRU5ATQG0AGAXUVDwB7WAEsALiMEA7fiAAeiAExcu6AJwAWAKwBmAIxcA7FrVqdijToA0IAJ6IDG9FoBsal1sVrF+vRq46AL6BNmjoAOoE4tSC5GJEYsQAwgAyAJJJANLcfEggQqIS0rIKCJ6qGu4GhjpaNf5qNvYIeq3oABx6hu3tpqZ6Wu06QSEgYWlSYtiCxOnk1EwAcvRJAPKomClMCzmyBeKSMnmlhopNiMYu6HqKrVw+hoY398GhGBNTM3MLy2sbWzs9LkBMIDsVjhcznYHIpOh0DGpTnpNDoXD1XmN3pNpsRyJgWJkVutNtsmLs8vsikdQKU9LVFOgND1kWpOt19OcEG41OgnrpysMnho9BjxtjBFhpgBbPCJPEEon-UnkkGFQ4lRBmBkaLwuFyVW769paTlqXToLg3Ia9WGaYWirGfdCLQQTPAAVzl+NIhL+JJ2vD2oKpGoQWsZuv13j0RpN0JasL08K4iNuKLR7Qd6A+03QKREsDEYCkxGYawA4os0uQmMgVflg+qIS0BqpYRoO-47p1TZYOjrDe0ngNWlmcxL84Xi2QqPRFqs0otMABVaj1ylNmkOPxXHTtDTGLQ3NFGzn79rOFzGPTtIx0-RaMfi9BJAAWYAAxgBrD7FxLrxtwS3MoanQCwdAPfRUx1dpOSRdR7lvPoDyMJ8nTfT8f0mP9iA4IEgzVID5EQOodDAyxIORU4YLPSp1A0fUPC0XRFFcEY3mzZ8MO-X9JlwxRgQbQjqWIkCyPAyjoNhTlWg8BCIK6ViXB0NQXlGMV0PfHjsL4jgdEEjciNKUjyIgmoqIsaT4wRVRjQGW9DC4A9BjQ3NuKwotdI0AzAJE4zQIk8ypNg+MzS0MCPG0YdhSQ1yJXc3j-y0HzhNDEzAqg6irOaRxwt0G5UW0Ji9Ti51BDEch3RIeUfUVf0yUDClfNDcMdXcKNDSZOMcq4QZ0GGG8uA8VpWh0QwswACSIMAmCkD9BHdbDsFmasfjqgEGpSsE-IcQYyL3DwdEQiDVMaeNBiTRRWOGTpblYpzJum2b5sWotlu+JZ1uVfCmtS5t7P29pDuOyoUzgm4wIGCxhS8fQake3BnoWpbcW9X1iQ2gC-uA2FzSHSpjXxxyQuaPUeWYwY0UslxYYRma5uRt70CR16wGWmr0aVAMtpDZtwLIzp9S0FNuk8brEEg9A0SOwbvHcIbH3UjApsRhnWewMq3U9VGFT9THGtVbbQ35+EhZF41WPBhlbk8DsbjMLp2MxdAVfpl6lrzAtPNLJgKyrGs6wNoSjb54apeHQxhS6XROQYpwjwsMxNH3GMzDplmPcnb2KEoOcFyXVcsZDnH9UMXknjG4ZzCizlUR5B5DDNPxjURCD07Vj2Ep0-8g8MnaEGUSOpZls19CMU5DE5SznHMyx7gsFQh3b92ma7zz-x+w3eZxownGUy1R+qCfa4PDpvF6hitGFHVFY412M9XrSPJwjgBII4vRMHveR-y8fFEn867h+pGH3KpSojltDL0ZmzF8T9Eq4X0u-ben9d7DwPr-R4-9Y7GHULUZSnhG5cHaLCKB6tYGYXgRwbySDNwoKHvvZEGDj7nWFuoIcLhqhGCvAEUhHsXQVSqmAHWtU9bKl7s1PmlgBYxm0ObMWnI6g8hUMoPBR0gasizEkAgMoRBSCgCteYn1RHcxoUZTUADmg+FYv2fwHDB7KA0Jo7ReBdH6I+r8DG30ea0NKIiKeV8LwHlUleQqTJjBOJ0Xo4RnN6pF2QaURQLh7i8jRE5S0uhiHiwHqcBkvQbxHTcJglwESXF6JfM46JX0TG-Q-rSLB8ZYQpjPnbK8STlA8KVuUyJUBNZSA9F6XWnjqlbx8YgI64VeqClUkDAatQp6slUPeXqFhdDKUUCU1xnspwljLKsSs1ZaxxNGVyVS1wtSmEbo3IWU99xl0UcLIaDEPBqA2WUrO04c550XCuNc4jsaiRPGBMwzFKjKXMPcKexgGRHW0JoAIKZ9SOM6Vo7p5DtLr1wn82pJF-AWhbioSOUUOQNKOvXW4vUhgJ3vK8npa8X6b2DvEkiR08UmAJR2UiegZKOVUI5ZiN5-BXVcLfZ2KLSm0rgd3fi3izFlFxUQtlu8iVcusvuJwqIHlpmGMKJ2YQxWbLpbpRBNSmVlBZQq1SSrOVTxUjyUwvUYzdHtMi5xmz+GVWqmjKpm1TH91aBYpQLdeTKAMOYY0Tlag0vQHEEQ35YAGLWsYn1Jrjk5LAndM0RDS7MRtY5MCY1EQW1vNoEVerXVlJjXGhNRihlkgZX3Y2V1yb7mFjDRJN4sk+DNPmy5RanLMSjZWr8sBJSCBlAMkRtajmyq6H2IGN41B+GYkYOoU9-6qAefqFSeoOzjRdaiodI6mAEDEAAITZtgEQcBq0eK5smkZM6CXkRqAUy0-8nhrropk-+rRtA+FLRgfVFaJBxq2d7XZ+yA7Tv7sof+-UHJMgfEDYhU8dzqEbsiEJeD9SDpA8OsDHzZzzm+YXLFprYNkSZAYAIVGroaCng63kTlwFmDGk83Dsb8OGp7jKv1e497GD5E8Dwjzc0XiMFdd9eCLAcdA9x3C9aJHATpPucOdQBjCeFvqVDV5GQKR6HqbVe6OJAZ6YetFz9dJvxTTO-jamhMxi0-Rhp-8GTGHMEkgYEEr6ya45KjFeleOhhUwJ9T6mRPaYaePa4aJFK6C4TTXzI75NUKC-9OzV4wuadE1F-Q-ZG76aHOYJLZUBGesGXe6DwXI4Cw4XkktK6A0D16jyIG90UxtbhlmZA0ghGpAyNkMjxy6ROEtF0S0hCdRhJkkDRkNRNCsnKP4NSowpCCAgHAWQaBfWhgALQWE5Ltq4KgTunbO8Z52OB8DTR282HUZ4kzmC8EQpkw131ZkiNEWI8RsBiFu8BPcG6qOnHcKiY0LgZJtEW70dJ9wzRxX+5-ZzpM8u3iPBRYYbhbilRwGO2UiOTgqX6oYGmbhQFMl6qaLwKSOECqeCLC7Glcwui1n9mz-d5vE9J6ySoFOsk3D6q4HUjwK7C0Z46XM7yRINv+vefqiYJPMn1CqnqHZrip2UjTc8HSOLjgs4lAnYzTn5JMBckt1h4yXDAjDkn-LXMAc4uhQQAAbZ3n4z0XqvfAdnoZOdjW5+TtH4MeRWiIfNx2QNSrkFfAtNnD6OdE-94knnydKfxmIU4XdBhYZ+BvOszpeuUiCEEF+Ug0xFoQENwgP3JPk+B7TzlPwFQ0mrNqJYcXjvmflQ9WAKvNeA+86D9ZAIEzw1A0mYk+GnT74dzelXrz4UDrxdhCdMG1lPBzavmiBi+5Mu8KZg-NmVe6O8ppmaPo95jCx1YZYNZqJnisg7zPleMCWd9M9MfheKSvCm8XYKLJGY6gJ4AQSSCse4++MCUux+ykTgQo3QfgdsxoCi+ovIQ4yI-8TIPgHgEBGs3G8+qkSYdQloNMTaTwTWF0-UrGeoFgJOY2OBWAJ6r4KQcAr4zQ8ejauKte5+-Q-+NqPIjc1oaqjwJgN49BmAjBqAkAYAuiBAn+nBZ+v+l+WS3m6uNQrgcO3gvQSKd8T0s+r+3egichp+P+F+vBLC4Uh4XgrQmgiSxoNKVelQMkgwZcPQ1cngZorSDupmXSeAVebgVwtw6i82sWKuDgmWYEQ0Xm3QgRLy+64qvS-S8+Nw8yrgHQMyaSygYWUaUBPuzYws4UTc3Qyc-qyOSgmgLhV8-gpwNMbeXh5aEqFC3cVee4Zc9woBbe+g7YTWVix2zwKY-g7e+eJm9RpWPefeQ0kMQR26nQoRLQnQF4QMbEgm5gNQHe3hh6fhQ8V09swsQMzk-OdozgrENwdIW6gwdRB6eGI6uO468+y6HQCqBUaIhKUIliNBYEGSYUVcQMxScRmy5mx6Hu2Al6m2uRwEQ4Zc7gfQi8TIZ0bxdEpg5gqYL6rgJWOR7BfMloFQ4Emubewona7x10vQzE3xvxwxlxnGyW-mf48+twSYHCF0dkWmMYNqyk1wdQTEloUEJW7qhhYJokAwrCt4dkWB+M92uWVwDJUKJJXQIofxwGlJzMJ6dxQpjxopLxNqG+dQsIykrQFMZJoqIxAJJ6LoKptkapYOGpDSueuCB4IatQCk3WuA2ix+t4ZEeoRorEKiVRU83IUs2gdwXa6InSPWUgve-JpQ4pOUs2yu3ggqHC3gMmwQgQQAA */
  context: ({ spawn }) => ({
    spstRef: spawn(speechstate, { input: settings }),
    lastResult: null,
  }),
  id: "DM",
  initial: "Prepare",
  states: {
    Prepare: {
      entry: ({ context }) => context.spstRef.send({ type: "PREPARE" }),
      on: { ASRTTS_READY: "WaitToStart" },
    },
    WaitToStart: {
      on: { CLICK: "Intro" },
    },
    Intro: {
      initial: "Prompt",
      on: {
        LISTEN_COMPLETE: [
          {
            target: ".CheckIntent",
            guard: ({ context }) => !!context.lastResult,
          },
          { target: ".NoInput" },
        ],
        SPEAK_COMPLETE: "HareEncounter" ,
      },
      states: {
        Prompt: {
          entry: { type: "spst.speak", params: { utterance: 
            `You had come to the forest to clear your mind. To escape the weight of everything that's been troubling you. 
            The sounds of nature and fresh air were supposed to help you find peace. 
            The city's noise. The endless pressures. The tangled emotions. Everything you've been running from seemed to fade with every step you took into the woods. 
            But as the night approaches and the forest grows darker, you realize the path has disappeared. 
            You're lost, and now, the woods feel less welcoming — you start feeling as if something is watching.
            You are starting to feel hungry and your body is tired after hours of walking.
            Around you there are berry bushes, though you are unsure whether they're safe to eat.
            Suddenly, you hear a strange noise coming from behind you.
            What do you do first?` } },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        NoInput: {
          entry: {
            type: "spst.speak",
            params: { utterance: `What was that? Please speak up.` },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        Listen: {
          entry: { type: "spst.listen" },
          on: {
            RECOGNISED: {
              actions: assign(({ event }) => {
                return { lastResult: event.nluValue };
              }),
            },
            ASR_NOINPUT: {
              actions: assign({ lastResult: null }),
            },
          },
        },
        CheckIntent: {
          always: [
            { guard: ({ context }) => context.lastResult?.topIntent == "CollectBerries",
              target: "CollectBerries",
              actions: ({ context }) => context.berries = true },
            { guard: ({ context }) => context.lastResult?.topIntent == "Shout" || context.lastResult?.topIntent == "WalkTowards",
              target: "Shout" },
            { guard: ({ context }) => context.lastResult?.topIntent == "LookAround",
              target: "LookAround" },
            { guard: ({ context }) => context.lastResult?.topIntent == "NotSure",
              target: "NotSure" },
            { guard: ({ context }) => context.lastResult?.topIntent == "Repeat",
              target: "Prompt" },
            { target: "NotSure" },
          ],
        },
        CollectBerries: {
          entry: { 
            type: "spst.speak",
            params: { utterance: 
              `You walk closer and inspect the berry bushes.
              They appear to be wild blueberries, and though you are not fully convinced, you decide to keep them for later.`
            },
          },
        },
        Shout: {
          entry: {
            type: "spst.speak",
            params: { utterance:
              `You shout into the void. "Hello? Who was that?", you say, but nobody answers.`
            },
          },
        },
        LookAround: {
          entry: {
            type: "spst.speak",
            params: { utterance:
              `You investigate your surroundings for any traces of a path or any signs of life.`
            },
          },
        },
        NotSure: {
          entry: {
            type: "spst.speak",
            params: { utterance:
              `What would you like to do? Perhaps you can check whether the berries are edible or investigate the strange sound.`,
            },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
      },
    },
    HareEncounter: {
      initial: "Encounter",
      on: {
        LISTEN_COMPLETE: [
          {
            target: ".CheckIntent",
            guard: ({ context }) => !!context.lastResult,
          },
          { target: ".NoInput" },
        ],
        SPEAK_COMPLETE: "Camping",
      },

      states: {
        Encounter: {
          entry: {
            type: "spst.speak",
            params: { utterance:
              `At that moment, a creature hops out of the bushes, breaking the silence of the forest.
              Upon closer inspection, it is a hare, and it is staring directly at you, strangely content.
              After a brief moment, the hare hops towards what looks like a trail, though you swear it was not there just a moment ago.
              Not having any other options you decide to walk along the trail despite it's suspicious reveal.
              After walking for a while, the path splits into two.
              Before you have time to think about which path to take, you hear a screech coming from one of the paths.
              Do you go towards the strange sound, or take the path away from it?`
            },
          },
          on: { SPEAK_COMPLETE: "Listen" }
        },
        NoInput: {
          entry: {
            type: "spst.speak",
            params: { utterance: `What was that? Please speak up.` },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        Listen: {
          entry: { type: "spst.listen" },
          on: {
            RECOGNISED: {
              actions: assign(({ event }) => {
                console.log(event)
                return { lastResult: event.nluValue };
              }),
            },
            ASR_NOINPUT: {
              actions: assign({ lastResult: null }),
            },
          },
        },
        CheckIntent: {
          always: [
            { guard: ({ context }) => context.lastResult?.topIntent == "WalkTowards" || context.lastResult?.topIntent == "Shout",
              target: "PathLeshy",
              actions: ({ context }) => context.dreamLeshy = true  },
            { guard: ({ context }) => context.lastResult?.topIntent == "WalkAway",
              target: "PathMedeina",
              actions: ({ context }) => context.dreamMedeina = true  },
            { guard: ({ context }) => context.lastResult?.topIntent == "NotSure",
              target: "NotSure" },
            { guard: ({ context }) => context.lastResult?.topIntent == "Repeat",
              target: "Encounter" },
            { target: "NotSure" },
          ],
        },
        PathLeshy: {
          entry: {
            type: "spst.speak",
            params: { utterance: 
              `You take the path to the right, following the strange sound.
              As you keep walking, the noise starts getting more and more faint, and in an attempt to catch up to it, you start increasing your pace.
              However, you notice something strange along the way.
              The screeching noise appears to be alternating directions, and you start feeling disoriented.
              You no longer know which way you came from and which way you're going.` },
          },
        },
        PathMedeina: {
          entry: {
            type: "spst.speak",
            params: { utterance: 
              `You take the path to the left, getting away from the strange sound.
              As you keep walking, you encounter the hare once again, which makes you hopeful that this path was the right choice.
              This hope fuels you with energy.` },
          },
        },
        NotSure: {
          entry: {
            type: "spst.speak",
            params: { utterance:
              `You can play it safe by going away from the noise, 
              or hope that you might get some help from the suspicious presence.`
            },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
      },
    },
    Camping: {
      initial: "Camp",
      on: {
        LISTEN_COMPLETE: [
          {
            target: ".CheckIntent",
            guard: ({ context }) => !!context.lastResult,
          },
          { target: ".NoInput" },
        ],
        SPEAK_COMPLETE: "Dream",
      },
      states: {
        Camp: {
          entry: {
            type: "spst.speak",
            params: { utterance:
              `The night grows darker and you start to accept the fact that you're not making it out of the forest tonight.
              Luckily, you approach a clearing and decide to camp out the night. It's getting colder and you long for the warmth of your home.
              You start thinking of ways to fight off the cold, what do you do?`
            },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        NoInput: {
          entry: {
            type: "spst.speak",
            params: { utterance: `What was that? Please speak up.` },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        Listen: {
          entry: { type: "spst.listen" },
          on: {
            RECOGNISED: {
              actions: assign(({ event }) => {
                console.log(event)
                return { lastResult: event.nluValue };
              }),
            },
            ASR_NOINPUT: {
              actions: assign({ lastResult: null }),
            },
          },
        },
        CheckIntent: {
          always: [
            { guard: ({ context }) => context.lastResult?.topIntent == "MakeCampfire" || context.lastResult?.topIntent == "LookAround",
              target: "Sticks",
              actions: ({ context }) => context.fire = true },
            { guard: ({ context }) => context.lastResult?.topIntent == "Repeat",
              target: "Camp" },
            { guard: ({ context }) => context.lastResult?.topIntent == "NotSure",
              target: "NotSure" },
            { target: "Sticks" },
          ],
        },
        NotSure: {
          entry: {
            type: "spst.speak",
            params: { utterance: `It is getting quite cold so it would be a good idea to make a fire, you could try looking around the area for fallen branches.`},
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        Sticks: {
          initial: "Prompt",
          on: {
            LISTEN_COMPLETE: [
              {
                target: ".CheckIntent",
                guard: ({ context }) => !!context.lastResult,
              },
              { target: "NoInput" },
            ],
          },
          states: {
            Prompt: {
              entry: {
                type: "spst.speak",
                params: ({ context }) => ({ utterance: `${ context.fire ? `You gather some sticks from the surrounding area and make a small fire.
                  You use the method your dad taught you when you went camping back in the day, and you then remember how long it's been since you two last talked.
                  I should give him a call once I get out of this forest, you think to yourself.` : "Not knowing what else to do, you decide to shiver through the night."} 
                  You feel your stomach growling again, ${ context.berries ? "do you want to eat the berries you picked up earlier?" : "you then remember the berry bushes you saw earlier today, but it's too late now." }`}),
              },
              on: { SPEAK_COMPLETE: [
                { target: "Listen", guard: ({ context }) => context.berries == true},
              ],
              },
            },
            EatBerries: {
              initial: "Listen",
              on: { LISTEN_COMPLETE: "CheckIntent" },
            },
            Listen: {
              entry: { type: "spst.listen" },
              on: {
                RECOGNISED: {
                  actions: assign(({ event }) => {
                    console.log(event)
                    return { lastResult: event.nluValue };
                  }),
                },
                ASR_NOINPUT: {
                  actions: assign({ lastResult: null }),
                },
              },
            },
            CheckIntent: {
              always: [
                { guard: ({ context }) => context.lastResult?.topIntent == "Yes" || context.lastResult?.topIntent == "CollectBerries",
                  target: "Eat" },
                { guard: ({ context }) => context.lastResult?.topIntent == "No",
                  target: "EatNo" },
                { guard: ({ context }) => context.lastResult?.topIntent == "Repeat",
                target: "Prompt" },
                { guard: ({ context }) => context.lastResult?.topIntent == "NotSure",
                  target: "NotSure" },
                { target: "NotSure" },
              ],
            },
            NotSure: {
              entry: {
                type: "spst.speak",
                params: { utterance: `You either eat them or you don't, it's not that complicated...`}
              },
              on: { SPEAK_COMPLETE: "Listen" },
            },
            Eat: {
              entry: {
                type: "spst.speak",
                params: { utterance: `You eat the berries, they have a strong sour taste, but you don't have the luxury to care.` },
              },
            },
            EatNo: {
              entry: {
                type: "spst.speak",
                params: { utterance: `You are hungry but not enough to risk your life, you decide not to eat the berries` },
              },
            },
          },
        },
      },
    },
    Dream: {
      initial: "Narrate",
      on: {
        LISTEN_COMPLETE: [
          {
            target: ".CheckIntent",
            guard: ({ context }) => !!context.lastResult,
          },
          { target: ".NoInput" },
        ],
        // SPEAK_COMPLETE: "nextstate",
      },
      states: {
        Narrate: {
          entry: {
            type: "spst.speak",
            params: ({ context }) => ({ utterance:
              `You make yourself a makeshift bed using leafage from the surrounding area and lay down.
              It's not the most comfortable, but you're too tired to care. ${context.fire ? "The gentle warmth of the fire fills you with hope." : " "}`
            }),
          },
          on: { SPEAK_COMPLETE: "Sleep" }
        },
        NoInput: {
          entry: {
            type: "spst.speak",
            params: { utterance: `What was that? Please speak up.` },
          },
          on: { SPEAK_COMPLETE: "Listen" },
        },
        Listen: {
          entry: { type: "spst.listen" },
          on: {
            RECOGNISED: {
              actions: assign(({ event }) => {
                console.log(event)
                return { lastResult: event.nluValue };
              }),
            },
            ASR_NOINPUT: {
              actions: assign({ lastResult: null }),
            },
          },
        },
        CheckIntent: {
          always: [
            // {guard: ({ context }) => context.lastResult?.topIntent == "NotSure", 
            // target: "NotSure" },
            {guard: ({ context }) => context.lastResult?.topIntent == "Repeat", 
            target: "Narrate" },
            // {guard: ({ context }) => context.lastResult?.topIntent == "", 
            // target: "" },
            // {guard: ({ context }) => context.lastResult?.topIntent == "", 
            // target: "" },
            // { target: "NotSure" }
          ],
        },
        // next state
        Sleep: {

        }
      },
    },

    Done: {
      entry: {
        type: "spst.speak",
        params: { utterance: `Thanks for playing!`}
      },
      on: {
        CLICK: "WaitToStart"
      },
    },
  },
},
);

const dmActor = createActor(dmMachine, {
  inspect: inspector.inspect,
}).start();

dmActor.subscribe((state) => {
  console.group("State update");
  console.log("State value:", state.value);
  console.log("State context:", state.context);
  console.groupEnd();
});

export function setupButton(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    dmActor.send({ type: "CLICK" });
  });
  dmActor.subscribe((snapshot) => {
    const meta: { view?: string } = Object.values(
      snapshot.context.spstRef.getSnapshot().getMeta(),
    )[0] || {
      view: undefined,
    };
    element.innerHTML = `${meta.view}`;
  });
}
