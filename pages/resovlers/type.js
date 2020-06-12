import * as fs from "fs";
import * as path from "path";
import { gql } from "apollo-server-micro";

const Type = {
  mutation: {
    CreateType: async (parent, args, context) => {
      console.log(args.input.properties[0]["key"]);
      console.log(context);
      const properties = args.input.properties.reduce((accu, prop) => {
        console.log(prop.key);
        return `${accu}
	${prop.key}: ${prop.type}`;
      }, "");
      await fs.writeFileSync(
        "/home/dakotal/Projects/PlayStuff/SSR-CMS/ssr-cms/pages/api/schema.graphql",
        `${fs
          .readFileSync(
            "/home/dakotal/Projects/PlayStuff/SSR-CMS/ssr-cms/pages/api/schema.graphql"
          )
          .toString()}
type ${args.input.name} {
	${properties}
}
`
      );
      return true;
    },
  },
};

export default Type;
