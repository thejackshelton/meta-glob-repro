import {
  type Component,
  type PropsOf,
  component$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Carousel } from "@qwik-ui/headless";
import { metaGlobComponents, rawComponents } from "~/utils/component-import";

import { Highlight } from "./highlight";
import { isDev } from "@builder.io/qwik/build";
import { useLocation } from "@builder.io/qwik-city";

type ShowcaseProps = PropsOf<"div"> & {
  name?: string;
};

export const Showcase = component$<ShowcaseProps>(({ name, ...props }) => {
  const location = useLocation();
  const componentPath = `/src/routes${location.url.pathname}examples/${name}.tsx`;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const MetaGlobComponentSig = useSignal<Component<any>>();
  const componentCodeSig = useSignal<string>();

  useTask$(async () => {
    MetaGlobComponentSig.value = await metaGlobComponents[componentPath]();
    componentCodeSig.value = await rawComponents[componentPath]();
  });

  return (
    <Carousel.Root>
      <Carousel.Pagination>
        <Carousel.Bullet>Preview</Carousel.Bullet>
        <Carousel.Bullet>Code</Carousel.Bullet>
      </Carousel.Pagination>

      <Carousel.Slide>
        <section class="flex flex-col items-center">
          {MetaGlobComponentSig.value && <MetaGlobComponentSig.value />}
        </section>
      </Carousel.Slide>
      <Carousel.Slide>
        <Highlight code={componentCodeSig.value || ""} />
      </Carousel.Slide>
    </Carousel.Root>
  );
});
