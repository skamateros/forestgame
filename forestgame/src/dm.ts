import { assign, createActor, setup } from "xstate";
import { Settings, speechstate } from "speechstate";
import { createBrowserInspector } from "@statelyai/inspect";
import { KEY, NLU_KEY } from "./azure";
import { DMContext, DMEvents } from "./types";

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
  /** @xstate-layout N4IgpgJg5mDOIC5QBECyA6ACgJzABwENcBiAQQGUAlAFWvIH1KBRU5ATQG0AGAXUVDwB7WAEsALiMEA7fiAAeiAExcu6AJwAWAKwBmAIxcA7FrVqdijToA0IAJ6IDG9FoBsal1sVrF+vRq46AL6BNmjoAOoE4tSC5GJEYsQAwgAyAJJJANLcfEggQqIS0rIKCJ6qGu4GhjpaNf5qNvYIeq3oABx6hu3tpqZ6Wu06QSEgYWlSYtiCxOnk1EwAcvRJAPKomClMCzmyBeKSMnmlanroXH3tRu0at4rdTYi3auh6alytLoZ6OgHtLi5gqEMBMpjM5gtlmsNlsdnpcgJhAdisdEKdzpdrrcNPd2o8EGpDE52oZTP9dFxFCTFECxiDJtNiORMCxMit1pttkxdnl9kUjqBSj9POgND03mpOt19Pi3C9vrpysNvho9LTxgzBFhpgBbPCJZms9kwrk8xGFQ4lNFaM6edzaQxcFwXH6yjQuc6ddq6RQuMUuRRadX0sHoRaCCZ4ACuBpZpDZ0M5O14eyR-KtBJtzi8frqTpd1jsaKJHVJko8vyphhpow1oZSIlgYjAUmIzDWAHFFmlyExkGb8mnLaiWno3OgdDccRpSVpPDpDLKdB7TnofGujE61EHayHpugG02W2QqPRFqs0otMABVagDvnDwUOMdaUU3GomVq-QwufFaVXoC4y4+v41aVGowboKC+5JAAFmAADGADWoItok95DiiT5lN4E6WNoOiSmO3q-kWCCqk4hJ6O0FjDE6gbaJB0FanBiEoZMaHEBw8KphaWHyIgJiKHhOgEURLgkX+ljnAMM6Sr0XQzkxmroKxyGoZMXGKAig58QKAk4cJomibo4mSWR3rtOoYH6EJvz-MpoZqexzaaRwOg6Q+-GlEJIliZ0EmuPi0rqMoJhaFw-hfEBjkwfB6kcW5GieZh+k+bhxn+cRQVkX6VnDLcKoRRcZixSx8UuZxHBaClekZr5mWmQF5nNDUVnOpSEWkhYxhlWGghiOQUYkIa8bGkm3IpryqUZtuto5g6+anIWrVZv4XA0RtM4BDWwLoAAEkQYBMFICGCFGHHYLMPaQuNsKTbVyJpQ4XzEhWJFvBFpGrcJOYRfoqo2gMkGHbgJ1nRdzZXRCSx3aaPHTXVI5jiW5KTq4n1OviPQ6OgVJ+i6lR1DcINHeD52XUycYJhy90YUj2GKBupaDB4c4Sa6ZEGKYzgXGFFgAkzaq7gdZOnRTUPoOTkNgFdo00yayaPemI6BoGePbr8QF+P+XBaG6TjGKqQxfooTPtKTYPizL2D9ZGMZU0aiZ01N5pPRmauvl4FLa9o-j6xZQx4-8DR+Nu3QaJbx3W5dB6Nq5bZMJ23a9v2ru6e7qtErjAwqF4BH-v+S6voMwG9BJXwWyLoPRxDseHgnFCUGeF5Xre9OZ4zNQvIGlL4xJM6KFJqj2e4HwSZZkfV2LdeS85GnoenXnPQgTMAq8Fx6067rdHiZGqrjfqWBtkW+gGARR9Lsfz4l6EI27KuM2OHrc1vfqV3vzQ2lZ7jmG8r3+GXJfGOc8KoLy0srR8Bk14v03l9HePRgpfAnKSD4UVTAeEBNPK2s9ZaqTAbfLiHleKd2gc-De7x4EfzdIYc4ToriUlMMZCC2Da4SzwTfVy6FkokMfmQ9er8qG72Cmbc4gxDDGGrKSAGwDcG23DINYaYBHZjWdqaJeM1VaeC9prJ0ANdYB1WqoIw5gVAeC-MLPaSQCB6hEFIKA115iwzUUrXhUCThOABKJQq-htDm3xG8Hw6BqwY1JEBYw-5ILWNsfYxxt0XHcnvhnPhHjAJAWxESSKnhqL4iZu6CczoAyqiZgEFhVibF4DsQ4+WcNXGI1IaUHwP5sytDXEzf8wEAmoNFB8bePR6ilRFtEyp9jVIVJUQrCaHcUlKEdDJb4etvjKG+N9JQgZcZGAkqcL4gwxRT3KTEqAdspDRljE7Wm6jIHeUEh4CcvdaiV2ohtXJtxcYmD9I4Tw3RJRRIqVUuOR5WztlWF2HsfZpnuIcDtV4pwaKLQGEXMiZsXBnAkZFXwhJOh61+YcgFjdTznkvDeO8GiGYGQMFSDWyzCS1CBrk8hRNPDaBoq0VwOKRlHM4VVUlDTBILmCZUEyYoIrrICe8WhFKUU2iMD+JSQy-mjK5W5JJy96r3AFWYP23pOorQcF4Ky4ijA2kGFcKuByOX4LYuAjg2k3HXLKPyokmr-zatFVzO4eN3Rzl6JUXo9x2X-KVehYh9SZllHVU6oVrrdBisJKWZZtQoo2l2nSMZuKFFDRGtTWpD07Urz8a8SydQupuBRRoXJ6zzg-l6I6boXiA2jLiCIZCsA4nOIuXUh+kKEASJ0TiP4VREFIoCB6D4RtTC6wCIYBtRym0trbVCDtiSrkry6AMYJz83AlVzrq1ebSOjuCFj+NcM4Rjmv+XOpCsBtSCD1Gc1RS6IX2sUvNXQy5PpfMaFzf4+UaLKCMGbMkO5z2NokC2qWBAxAACFZbYBEHABdOan2rpUJRaoxhRJdC8Lu6iM5gn0PuO8Lo5IZ3oEvdepgkGYPYDg3APFx5gWgtTsh2QzRqJXHUNsgMyo3B70aT0Usy4SREgok6Uj5GIPQdg-B69DdjxNxbkS9uPKw1UisiSITEjbh+Cxt+8wnHn4+AXLx8TYGr30aBUnEFKdwUqe7codWkVVRmD1kBZQ5auYiY6M6DDlQPjEdM828zcnWwKcJW3ElK6PaUjOH4bEf6UYBgCX6F4rM9bunePqwL4Gg1cTs8+uizgeg+dcAGbZuSPjCQy+8ImPQxQprCMMi9Znr25e4lF5Gk4jKETHFktwrMum3NskSf8bxehDGy+ZtrtrQ3dp+DRCcPXnTaH6-8AJJJVDpICqcFQ6XJutYIVwohHXsLze69svr241tcx2ecSo1ZvAaa6FgkDs6WuWoSkdjgPDZsFYW8MC7K2rurJaGV4J+d3iaE8EMYDqamugaC9ejNSiJlIfy6uokr7hgou3J+5LdQBX+y07iM9qbyAABswD4FRwkljI4bQvyuKYLwgYbQ1Fyf8D0dofzLnkmuWHYQKdU7wDTx9KrNHYRuCPE2AwOo9C8Bz9e3OgK8c6A1jAyBcA2JSHAWCthEO0-RxmUS6nhhMsI-1gY+JajDFeD+e0kVNneEgprsA2vdf65houxWy680Zh+C8Scx8f0NHCdbh7gE-O1GrEMAELutc6h17APXoufd09O8uVQuGpyEk3DKJFzSSTGx-JFNcbx49u8Tx79AqAqcSFiTUw3J3oF6yK7x30a4PDGGt60QP-7SSkndFSCv7vk+2HQAARSjHAfkqeplG9Vq31mkoO++mLeH9EM5tBzi8B8bHI+q9j+OacufLtm+NKX-8FfKK1-d7It+M4pijCEk0AGM1qbXej71xZxOycwVp3PyUA+E43MHMBvy70MUQH0E6FeG3yYVcEIjnAPyT2-xCxPGbnC2JXTxbzOCYR8FXwgOtzU2cFuBHRIkQIFw1wTxQPHzawX1O3-EAi8Cu2Zz1gc2t0QPUGnGzgQNx2QOrza3FzJSFEYLKxYO8DYMpGt29Fxl+BUCJG9DeA+H4KP2m0AJaFEOYMGFYPKCHnv23BfjMF+D8CNiARFk-0P2-zaxDS7WfU0InV6AkN0PxH9heA2g8CpAuBrUsQ-2oOr2oGwCjCbFP0uT90XxLivxonAPX33k+B6QHj1klCohUO-3DACKCPvUmTPzCMZkv3b2iLv2aFVG6DxlAOdF627gP1rwgDADsQIAN0fXoPJUIlUE-X0DMCl19Gt10FgT30CRRWUPMIT2qNqKkHqK9yQyEN5VHAsCYIMGojqHAi-WaAXC8EjyIwHjDluCqMgFGPqMb0aPUJ+GdELT2Xuzzz0ArXU0xxJGWzL1OB2JqLqJrzryqRCM7WSTm2oheFl140Ik1hjXv171gKFn0G6mM0eL2Mn2nybEOHeNzV+xQwEwJj8DNnuCig3zOC3x6MAV9HV3QAsJGOePDHtkyLRyOO+NeFK0lH+MVF3QfxBIsXBJ-EhOeLQMYxswAJyPJQWOcDKzFFpJtx7w43cB53RIMGxSGMryJLGJ-zC1biwKaKFF5NcHziGAnSFPv2IOXB80pFVBUEoIJOGN2OeLoIpMnBhVFJnG+WYI4O3GCVzBlX1MlL2kJJNNlMEPNKsglFegkT9VMGkN0AnF2znHcBFW3FZI9MOyqhm1sNXXm0tN9JtIDP0NcBhXMBohNVcENLdKeKjKtUIXci9MTKJD9O8BTKKMSM9A8D5jLxUFJzCFzKhPSOCIOLTyVKhWRP8FRLNkyRB1VDHHiJZSWR8MbONLzIIH6hbLJKb25KFA2nam7JxF7IxNiJKPwMw3uEnAkhd2kGUVSAyGyA7JaFEhki6DHRqwsBJHWw9FPU0ElHKHWhrFGCkEEBqPgDyDQDnMQAAFpAl8QfzR1dsWjIpTgh8XtU0cB8AjpvzyI9DmgYDzBd8bhyQ1wJFIJIhohYh4hsAxBYLJxWixQsNf5AoQdWl1BLIiNwzDTmJYLpISpJQsQ7gHgtTiQbjKwwIfkRZmIb071YLjArIZwAwvoAcjNZRREYcfhPDHQxx8SeKSSTkYx+LBhRQfxe4gJCIxKyI5pAJhgWdQKcRdA+oQtYLWUqtPCegAMfNgp+UFjCQwlLBJRp1uKVIg06KLhg5agrgBKJ1CinhKgJxBhN5+klDNA+okhBBydKcEIpMaMZNlLBK1KRLNLhgXC1wYUFksMfw8xnK9oeLyBYJzo8LESMwBLVLhK9EUrd02dnAxxWhqwvhscaKVIUhBBBAkJSBpgLoIAEryr1LRLUqLJbdT0nQB9hQkCXLQxkdcBeqhL+qqqRFvTRt6yFJvRcrU0a4r4oZTKAwPQ0YPptxdMVigl-wAQ6qAw3gFRZF2FbYtrZZYKjNfpjYBhzAPxd0LreYFD-hQCTB38whNqQE8EFLTkHq9LPVqIXqtzASEKTjSlq1z4wKykNqZ4bqLMHqGr0yVdugpCyIPwOhS46hq17sIL-qUabYPtKpJhTKmE7siNjAu8-5goRR3QCJO860zZrrybMBINYIaDQb9MLAIafQ3q0rVAr85xRIJJKQL5WE7rbZuaxBYIZSCB+anqhbXrNSv5Bz2Nskt5y9ZbAb5EBpM0wBVbwbOhhbNbEAMaoiVs8k7QSaMB4coBYK-zbgAleTZVSRqJJxhhzBSNhlYK3BcZ5dUSfgGr882MtzPQJEDBdAi8ZbXtj8lKSqRxRInrNAfgxR+gMFckIoXhwkNo1ZfE5Uk6TLU7sJugvYAhtymlNB3akUooN5USGgAhxEA7oyqaK6DIg9AIfV6sYcrgPAxUglegHkUVnRvB-b5V01jalF+KAgOgWUcRw7fRI6HBVQPRSy3hLB9VAx9tXb3AAl-wqsnQ6gzZbhbj9teL9RTKXVVLPoFlTh7R1ttBXhE1PAqQmE-qnaFU3tEdJNqNaMPy4yMwfyxQuk36AQi9lxVj3gf600LUJNKNYrgG0bu7SguB1sRSuMjN7cEHnayN3ty7QHF8NoY7TUFxtCFxX7XxhQ-Ev6zAWSZ6kH3s3KMG9UPLCM17WcbRJwxUUVzhNL6q3BMcGzf7cUJNprTaOGNCxQH7w5uZ-4PM2N0lRQaULhfhCQL7r6UG775GZxH6lGX6uZDrRR-xnNqRqhHbEHmsAGUHwx9HEqjGXQTG2Nu4OhZLq1YVvAbGhd8BYKhgf5nsBgxttwzBclHQnAfAAxSROg-BGqUjmhSHsI-zTzLLt8fg-ATZd19VcZTAagqQT7f51qxzK8aCXiwB68XbZGfz-gl6sk+Hsn9B6TgSn8B9X9h8pSv9x8p8Z8oFVURw6m9qrhMmAYcnAyvZY6AhAYjNxGjTynq9gaU6UmDJhmGmxnmnOYVi5DdL4GfwOYYpunLDx8SHPj7V1mMm5wsmBTtmoCiL1AgrcdN6uLXS-DVDO7irVnShLnRnrnxmWnrcvE8ZpnMN5xhgkn0BpzXb6mrmmnbnd1AEucqhWg1N7dIW0jAimwYWRnGmbmJn94mZaFTggZtkfBIpIXIgkIwBrw8AcWNn-mtnEX-jSjilHQvLCJIyVbZGFC7d7gnMhg19cmaTPGzAcd7g6haguXKnqnAn3A+7fGz7TIZwe83hGSsnmSbGmzni+nYT+JBnK75WsqBWwDoaoDvRXxt1lwywbh5ntXZTlmvnzmV5y4FXfQlXCIVX79dn3RUW477gahpWzmDWDJXWtl3W2ZPXFx78Hnsa1w-UgINppX2HvnEAw2E2PXNBo2VjgWrWvgyRLBpXoWeWjWpETWhWXCR1RQIbbhGqFwJtjnlapysWnWQ3Sgwk+WomBSK3CWuhgkFwBgGI3AfhpWqWaW6WS2X4y3L7TXmWeZXNet+1nhdypAZHU24KbzI9Al-AO9vALBghgggA */
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
      // on: { CLICK: "DreamLeshy" },
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
            The city's noise. The endless pressures. Everything you've been running from seemed to fade with every step you took into the woods. 
            But as the night approaches and the forest grows darker, you realize the path has disappeared. 
            You're lost, and now, the woods feel less welcoming — you start feeling as if something is watching.
            You are starting to feel hungry and your body is tired after hours of walking.
            Around you, you see berry bushes, though you are unsure whether they're safe to eat.
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
              `You shout into the void. "Hello? Who was that?", you say.`
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
              You hear a screech coming from one of the paths.
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
              actions: ({ context }) => context.choiceLeshy = true  },
            { guard: ({ context }) => context.lastResult?.topIntent == "WalkAway",
              target: "PathMedeina",
              actions: ({ context }) => context.choiceMedeina = true  },
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
        SPEAK_COMPLETE: "Sleep",
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
          on: {
            SPEAK_COMPLETE: "Listen",
          },
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
                  You feel your stomach growling again, ${ context.berries ? "do you want to eat the berries you picked up earlier?" : "you then remember the berry bushes you saw earlier today, you now wish you had picked them up." }`}),
              },
              on: { SPEAK_COMPLETE: [
                { target: "EatBerries", guard: ({ context }) => context.berries == true},
              ],
              },
            },
            EatBerries: {
              initial: "Listen",
              on: { LISTEN_COMPLETE: "CheckIntent" },
              states: {
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
              },
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
    Sleep: {
      entry: {
        type: "spst.speak",
        params: ({ context }) => ({ utterance:
          `You make yourself a make-shift bed using leafage from the surrounding area and lay down in it.
          It's not the most comfortable, but you're too tired to care. ${context.fire ? "The gentle warmth of the fire fills you with hope." : " "}`
        }),
      },
      on: { 
        SPEAK_COMPLETE: [
                { target: "DreamLeshy", guard: ({ context }) => context.choiceLeshy == true },
                { target: "DreamMedeina", guard: ({ context }) => context.choiceMedeina == true },
              ],
            },
          },
    DreamLeshy: {
      initial: "Meeting",
      on: {
        LISTEN_COMPLETE: [
          {
            target: ".CheckIntent",
            guard: ({ context }) => !!context.lastResult,
          },
          { target: ".NoInput" },
        ],
        SPEAK_COMPLETE: "Done",
      },
      states: {
        Meeting: {
          entry: {
            type: "spst.speak",
            params: { utterance: 
              `You sink deeper into sleep, the rustling of the leaves slowly turn into creepy whispers, and then you see him. 
              A towering dark figure, 3 meters tall, looming over you with his gleaming eyes and wide smirk. "Who... what are you?", you shyly ask.
              He lets out an eerie chuckle before answering. Leshy. That is what they call me".
              He tilts his head, studying you like his next meal.` 
            },
          },
          on: { SPEAK_COMPLETE: "Question" },
        },
        Question: {
          entry: {
            type: "spst.speak",
            params: { utterance: `Tell me, traveller, do you really think you have the right to set foot in my forest?` }
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
              target: "NoInput"
            },
          },
        },
        CheckIntent: {
          always: [
            { guard: ({ context }) => context.lastResult?.topIntent == "NotSure", 
            target: "Question" },
            { guard: ({ context }) => context.lastResult?.topIntent == "Repeat", 
            target: "Question" },
            { guard: ({ context }) => context.lastResult?.topIntent == "Yes", 
            target: "Yes",
            actions: ({ context }) => [context.choiceMedeina = false, context.choiceLeshy = true] },
            { guard: ({ context }) => context.lastResult?.topIntent == "No", 
            target: "No",
            actions: ({ context }) => [context.choiceMedeina = true, context.choiceLeshy = false] },
            { target: "Question" }
          ],
        },
        Yes: {
          entry: {
            type: "spst.speak",
            params: { utterance: `Oh really? He laughs. Such audacity! Then you best be prepared, little one.
              The forest does not take kindly to arrogance, that is for certain!`
            },
          },
          on: { SPEAK_COMPLETE: "WakeUp" },
        },
        No: {
          entry: {
            type: "spst.speak",
            params: { utterance: `At least you still got some sense in that head of yours. He laughs. His evil grin is still present, but his tone softens slightly.
              Know your place, and the forest might show you mercy.` }
          },
          on: { SPEAK_COMPLETE: "WakeUp" }
        },
        WakeUp: {
          entry: {
            type: "spst.speak",
            params: ({ context }) => ({ utterance: `At that moment, a hare jumps out of a nearby shrub, and Leshy's expression suddenly morphs from cunning to genuine fear.
              His gleaming eyes turn towards the creature, and then back to you. "Get Out!", he screams, before he becomes one with the nearby trees. 
              The forest around you begins to blur, the trees' branches crackling and twisting around. Before you know it, you are awake.
              You feel the morning rain on your skin, as your heart is still pounding. ${context.choiceLeshy ? "Who does he think he is anyways?" : "That was bizarre, you think to yourself, I better be careful from now onwards." }
              "Can I really trust a word he says?", you think as you rush to find cover from the rain.` 
            }),
          },
        },
      },
    },
    DreamMedeina: {
      initial: "Meeting",
      on: {
        LISTEN_COMPLETE: [
          {
            target: ".CheckIntent",
            guard: ({ context }) => !!context.lastResult,
          },
          { target: ".NoInput" },
        ],
        SPEAK_COMPLETE: "Done",
      },
      states: {
        Meeting: {
          entry: {
            type: "spst.speak",
            params: { utterance: 
              `You fall deeper and deeper asleep, and the rustling of the leaves slowly turn into whispers, and then you see her. 
              A petite long-haired woman surrounded by wolves. She is human, but you see something primal about her.
              "I am Medeina", she says. "The spirits of the forest are not happy with your presence, but fear not.
              You should be able to get out of this forest safely as long as you listen to its voice.` 
            },
          },
          on: { SPEAK_COMPLETE: "Question" },
        },
        Question: {
          entry: {
            type: "spst.speak",
            params: { utterance: `So tell me, are you willing to trust nature?` }
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
            { guard: ({ context }) => context.lastResult?.topIntent == "NotSure", 
            target: "Question" },
            { guard: ({ context }) => context.lastResult?.topIntent == "Repeat", 
            target: "Question" },
            { guard: ({ context }) => context.lastResult?.topIntent == "Yes", 
            target: "Trust",
            actions: ({ context }) => [context.choiceMedeina = true, context.choiceLeshy = false] },
            { guard: ({ context }) => context.lastResult?.topIntent == "No", 
            target: "NoTrust",
            actions: ({ context }) => [context.choiceMedeina = false, context.choiceLeshy = true] },
            { target: "Question" }
          ],
        },
        Trust: {
          entry: {
            type: "spst.speak",
            params: { utterance: `Then you are already on the right path. The forest watches over those who walk with respect.`
            },
          },
          on: { SPEAK_COMPLETE: "WakeUp" },
        },
        NoTrust: {
          entry: {
            type: "spst.speak",
            params: { utterance: `Very well, then you walk alone, that is your choice. Just know that he will not be as kind to you as I was.` }
          },
          on: { SPEAK_COMPLETE: "WakeUp" }
        },
        WakeUp: {
          entry: {
            type: "spst.speak",
            params: ({ context }) => ({ utterance: `At that moment, one of the wolves lets out a sharp howl, breaking the stillness of the moment, and Medeina's expression is painted with concern.
              Before you can say a word, she drops on all fours and runs away into the forest alongside her pack.
              You then feel a sudden chill, pulling you away from the dreamy state you were in, and forcing you back to reality.
              You open your eyes as you feel the morning rain on your skin. ${context.choiceMedeina ? "The forest watches over those who walk with respect" : "He will not be as kind to you as I was" }, her voice echoes in your head.
              "Can I really trust her?", you think as you rush to find cover from the rain.` 
            }),
          },
        }
      },
    },

    Done: {
      entry: {
        type: "spst.speak",
        params: { utterance: `To be continued... Thanks for playing!`}
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
