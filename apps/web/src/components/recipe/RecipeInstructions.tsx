import React from 'react';
import { Grid } from '@mantine/core';
import { Card, Text, Group } from '@mantine/core';

interface IRecipeInstructionsProps {}

export function RecipeInstructions(props: IRecipeInstructionsProps) {
  return (
    <Grid grow gutter="xs" columns={1}>
      <Grid.Col span={1}>
        <Group position="apart">
          <Text weight={500}>Instructions</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          Working in the bowl of a stand mixer fitted with the paddle
          attachment. or in a large bowl with a hand mixer, beat the butter,
          both sugars and the salt together on medium speed until creamy, about
          2 minutes. Beat in the vanilla.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          Turn off the mixer, scrape down the bowl and add the flour all at
          once. Pulse the mixer a few times, just until the risk of flying flour
          has passed, and then, working on low speed, beat until the flour is
          almost completely incorporated, a couple of minutes. Don’t beat too
          much—you want the mixture to be more clumpy than smooth. Still working
          on low speed, mix in the chocolate and nuts. Then finish incorporating
          the chunky ingredients with a flexible spatula.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          Turn the dough out onto the work surface and knead it to bring it
          together. Divide the dough in half and shape each hunk into a
          6-inch-long log (the rolls will be a scant 2 inches in diameter). Wrap
          each log well and refrigerate until firm, at least 2 hours. (You can
          refrigerate the logs for up to 3 days. Or you can freeze them, wrapped
          airtight, for up to 2 months; let stand at room temperature for about
          an hour before slicing and baking, or defrost in the fridge
          overnight.)
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          WHEN YOU’RE READY TO BAKE: Center a rack in the oven and preheat it to
          350 degrees F. (If you can’t fit two muffin tins on one rack in your
          oven, position the racks to divide the oven into thirds.) Butter two
          regular-size muffin tins—you can use bakers’ spray, but butter is
          really nicer for these.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          One at a time, mark each log at ½-inch intervals and, working with a
          chef’s knife, cut into rounds. Place each puck in a muffin cup.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          Bake for 20 to 22 minutes, rotating the pans if necessary, or until
          the cookies are golden on top, browned around the edges and slightly
          soft in the center as they’ll firm as they cool. Transfer the pans to
          racks and let rest for 3 minutes, then gently pry each cookie out with
          the tip of a table knife and place on the racks to cool. You can serve
          the cookies warm, but their texture shines brighter at room
          temperature.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          STORING: Kept in an airtight container at room temperature, the
          cookies will be good for at least 5 days.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          A NOTE ON MUFFIN-TIN BAKING: You might be tempted to use a baking
          sheet, but I hope you won’t—the texture is really best in the muffin
          tins.
        </Card>
      </Grid.Col>
      <Grid.Col span={1}>
        <Card shadow="sm" p="lg">
          PLAN AHEAD: The dough needs to be refrigerated for 2 hours
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default RecipeInstructions;
