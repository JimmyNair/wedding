import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HeartIcon from "@mui/icons-material/Favorite";
import {
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  styled,
  Typography,
} from "@mui/material";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { firestore } from "../lib/firebase";
import { useMediaQuery } from "../lib/useMediaQuery";
import { BACKGROUND_COLOR, TitleLayout } from "../styles/constant";
import { Guest } from "./admin/types";
import { MessageForm } from "./MessageForm";
import { SelectButton } from "./SelectButton";
interface ComponentProps {
  isPortrait?: boolean;
  isSmall?: boolean;
}
const Section = styled("section", {
  shouldForwardProp: (prop) => prop !== "isPortrait",
})<ComponentProps>({
  height: "fit-content",
  overflow: "hidden",
  position: "relative",
  backgroundColor: BACKGROUND_COLOR,
  transition: "background 1s ease-in",
});

// const TitleLayout = styled("span", {
//   shouldForwardProp: (prop) => prop !== "isPortrait" && prop !== "isSmall",
// })<ComponentProps>(({ isSmall }) => ({
//   padding: `0 1rem`,
//   margin: "auto",
//   maxWidth: isSmall ? "95%" : "80%",
//   display: "inline-block",
//   // fontSize: "2.5rem",
// }));

const FormBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "isPortrait" && prop !== "isSmall",
})<ComponentProps>(({ isSmall }) => ({
  marginLeft: "auto",
  marginRight: "auto",
  padding: "1rem 0",
  paddingBottom: "3rem",
  maxWidth: isSmall ? "95%" : "80%",
  textAlign: "center",
}));

const Subtitle = styled("div")({
  maxWidth: "85%",
  textAlign: "center",
  margin: "0 auto 3rem",
  lineHeight: "120%",
});

type Props = {
  guest?: Guest;
};
export const Confirmation = (props: Props) => {
  const isSm = useMediaQuery("md");
  const [value, setValue] = useState<boolean>();
  const [num, setNum] = useState(0);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.guest) {
      try {
        const ref = doc(firestore, "guests", props.guest.url);
        const data: Guest = {
          ...props.guest,
          partyOf: num,
          ...(value !== undefined && { going: value }), //only append the going value if either true or false
        };

        await setDoc(ref, data);

        if (message !== "") {
          //set comments
          const commentCol = collection(firestore, "comments");
          await addDoc(commentCol, {
            message: message,
            guestId: props.guest.url,
          });
        }

        toast.success("Thank you for your response!");
        setSubmitted(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={submit}>
      <Section>
        <FormBox isSmall={isSm}>
          {/* <TitleLayout
            sx={{ backgroundColor: BACKGROUND_COLOR }}
            isSmall={isSm}
          >
            <span>Will you make it?</span>
          </TitleLayout> */}
          <TitleLayout variant="h1">
            Will you come celebrate with us?
          </TitleLayout>
          <Subtitle>
            <Typography variant="h5">
              We would love for you to join us there for our special day
            </Typography>
            <Typography variant="h5">
              Please kindly reply. We cannot wait to see you!
            </Typography>
          </Subtitle>
          <Grid container spacing={5}>
            {/* <Grid item xs={12}>
            <FormControl>
              <RadioGroup row name="rsvp">
                <FormControlLabel
                  value={true}
                  control={
                    <Radio
                      size="medium"
                      onChange={(e, checked) => setValue(true)}
                    />
                  }
                  label={"Accepts with pleasure"}
                  labelPlacement="bottom"
                />

                <FormControlLabel
                  value={false}
                  control={
                    <Radio
                      size="medium"
                      onChange={(e, v) => {
                        setValue(false);
                        setNum(0);
                      }}
                    />
                  }
                  label={"Decline with regrets"}
                  labelPlacement="bottom"
                />
              </RadioGroup>
            </FormControl>
          </Grid> */}

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <SelectButton
                selectedId={selected}
                onClick={function (id: string): void {
                  setSelected(id);
                  setValue(true);
                  window.scrollTo(0, document.body.scrollHeight);
                }}
                hasBorder
                id="yes"
              >
                Accepts with pleasure
              </SelectButton>

              <SelectButton
                selectedId={selected}
                onClick={function (id: string): void {
                  setSelected(id);
                  setValue(false);
                  setNum(0);
                  window.scrollTo(0, document.body.scrollHeight);
                }}
                id="no"
              >
                Decline with regrets
              </SelectButton>
            </Grid>

            {value === undefined ? (
              <></>
            ) : (
              <>
                {value ? (
                  <Grid item xs={12}>
                    <Subtitle>
                      <Typography
                        variant="h6"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "3rem",
                          fontWeight: "bold",
                        }}
                      >
                        Awesome! &#127881; How many people are coming?{" "}
                        <FormControl
                          sx={{
                            width: "5rem",
                            marginLeft: "0.5rem",
                          }}
                        >
                          <OutlinedInput
                            placeholder="0"
                            type="number"
                            inputProps={{ min: 1, max: 6 }}
                            onChange={(e) =>
                              setNum(parseFloat(e.currentTarget.value))
                            }
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                            // sx={{
                            //   "& .MuiOutlinedInput-root": {
                            //     "& fieldset": {
                            //       borderColor: "red",
                            //     },
                            //     "&:hover fieldset": {
                            //       borderColor: "yellow",
                            //     },
                            //     "&.Mui-focused fieldset": {
                            //       borderColor: "green",
                            //     },
                            //   },
                            // }}
                          />
                        </FormControl>
                      </Typography>
                    </Subtitle>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Subtitle>
                      <Typography
                        variant="h6"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "3rem",
                          fontWeight: "bold",
                        }}
                      >
                        Aw &#128549; that&apos;s okay. Do let us know if you
                        change your mind &#128523;
                      </Typography>
                    </Subtitle>
                  </Grid>
                )}
                <Grid item xs={12}>
                  {submitted ? (
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        color="success"
                        fontSize="large"
                        sx={{ mr: "1rem" }}
                      />
                      Your message has been recorded! Thank you so much!
                      <HeartIcon
                        color="error"
                        fontSize="large"
                        sx={{ ml: "1rem" }}
                      />
                    </Typography>
                  ) : (
                    <MessageForm value={message} handleChange={setMessage} />
                  )}
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                disabled={value === undefined}
                sx={{
                  border: `1px solid #121212`,
                  backgroundColor: BACKGROUND_COLOR,
                  color: "#121212",
                  // backgroundImage:
                  //   "linear-gradient(92deg, rgba(236,191,76,1) 0%, rgba(219,159,5,1) 59%, rgba(226,154,45,1) 100%);",
                  borderRadius: "1rem",
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  padding: isSm ? "1rem 1.6rem" : "1rem 2.6rem",
                  textAlign: "center",
                  touchAction: "manipulation",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Send
              </Button>
            </Grid>
          </Grid>{" "}
        </FormBox>
      </Section>
    </form>
  );
};
