module RockPaperScissors.SignPost exposing (main)


import Html
import Html.Attributes as Attribute
import QRCode


main: Program Flags Model Message
main =
    Html.programWithFlags
    {
      init = init
    , update = update
    , view = view
    , subscriptions = subscriptions
    }


init : Flags -> (Model, Cmd Message)
init flag =
    (flag, Cmd.none)


type alias Flags = Model


type alias Model =
    {
        gameId: String
    }


type Message =
      DoNothing
    | Update String


update : Message -> Model -> (Model, Cmd Message)
update msg model =
    case msg of
        DoNothing -> (model, Cmd.none)

        Update gameId -> ({ model | gameId = gameId }, Cmd.none)


view : Model -> Html.Html Message
view model =
    let
        header = "Game " ++ model.gameId
        href = "/join?gameId=" ++ model.gameId
    in
        Html.div
            [ Attribute.class "jumbotron" ]
            (List.concat [
              [ Html.h1 [] [ Html.text header ] ]
            , [ qrcodeView model ]
            , [ Html.div [] [ Html.a[ Attribute.href href ] [ Html.text href ] ] ]
            ])


qrcodeView : Model -> Html.Html Message
qrcodeView model =
    let
        message = "/join?gameId=" ++ model.gameId
    in
        QRCode.encode message
            |> Result.map QRCode.toSvg
            |> Result.withDefault (Html.text "Could not create QRCode")


subscriptions : Model -> Sub Message
subscriptions _ = Sub.none
