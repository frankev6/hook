import { getHeaderTitle } from "@react-navigation/elements";

header: ({ navigation, route, options, back }) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <MyHeader
      title={title}
      leftButton={
        back ? (
          <IconButton icon="arrow-left" onPress={navigation.goBack} />
        ) : undefined
      }
      style={options.headerStyle}
    />
  );
};
