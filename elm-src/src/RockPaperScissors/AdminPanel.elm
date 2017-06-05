port module RockPaperScissors.AdminPanel exposing (main)


import Html
import Html.Attributes as Attribute
import Html.Events as Event
import Http
import Json.Decode as Decode

main : Program Flags Model Message
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
    (emptyModel flag.gameId, Cmd.none)


type alias Flags =
    { gameId: String }


type alias Model =
    {
      history: List GameInfo
    , current: GameInfo
    }


type alias GameInfo =
    {
      gameId: GameId
    , registeredPlayers: Int
    , choicesMade: Int
    }


type alias GameId = String


type Message =
      DoNothing
    | PlayerRegistered
    | ChoiceMade
    | Resolve
    | Resolved (Result Http.Error String)
    | NextGame GameId


emptyModel : GameId -> Model
emptyModel gameId =
    { history = [], current = emptyGameInfo gameId }


emptyGameInfo : GameId -> GameInfo
emptyGameInfo gameId =
    { gameId = gameId, registeredPlayers = 0, choicesMade = 0 }


update : Message -> Model -> (Model, Cmd Message)
update message model =
    case message of
        DoNothing -> (model, Cmd.none)

        PlayerRegistered ->
            ({ model | current = registerPlayer model.current }, Cmd.none)

        ChoiceMade ->
            ({ model | current = registerChoice model.current }, Cmd.none)

        Resolve ->
            (model, resolve model)

        Resolved (_) ->
            (model, Cmd.none)

        NextGame gameId ->
            let
                history = model.current :: model.history

                current = emptyGameInfo gameId
            in
                ({ model | current = current, history = history }, Cmd.none)


registerPlayer : GameInfo -> GameInfo
registerPlayer gameInfo =
    { gameInfo | registeredPlayers = gameInfo.registeredPlayers + 1 }


registerChoice : GameInfo -> GameInfo
registerChoice gameInfo =
    { gameInfo | choicesMade = gameInfo.choicesMade + 1 }


resolve : Model -> Cmd Message
resolve model =
    let
        url =
            "/resolve?gameId=" ++ model.current.gameId

        request =
            Http.post url Http.emptyBody Decode.string
    in
        Http.send Resolved request


view : Model -> Html.Html Message
view model =
    let
        currentView = [viewGameInfo True model.current]

        historyView = List.map (viewGameInfo False) model.history
    in
        Html.div
            []
            (List.concat [currentView, historyView])


viewGameInfo : Bool -> GameInfo -> Html.Html Message
viewGameInfo showButton gameInfo =
    let
        button =
            if showButton then
                [
                 Html.button [
                      Attribute.classList
                          [
                           ("btn", True)
                          , ("btn-primary", True)
                          ]
                     , Event.onClick Resolve ] [ Html.text "resolve" ]
               ]
            else
                []
    in
        Html.div
            [ Attribute.class "game" ]
            (List.concat
                 [
                   [
                     Html.span [ Attribute.class "id" ] [ Html.text ("id: " ++ gameInfo.gameId) ]
                   , Html.span [ Attribute.classList
                                     [
                                       ("player", True)
                                     , ("count", True)
                                     ] ] [ Html.text ("players: " ++ (toString gameInfo.registeredPlayers)) ]
                   , Html.span [Attribute.classList
                                    [
                                      ("choices", True)
                                    , ("count", True)
                                    ] ] [ Html.text ("choices: " ++ (toString gameInfo.choicesMade)) ]
                   ]
                 , button
                 ]
        )


port event : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Message
subscriptions _ = Sub.batch
                  [
                   event fromType
                  ]


fromType : String -> Message
fromType message =
    if message == "registration" then
        PlayerRegistered
    else
        if message == "pick" then
            ChoiceMade
        else
            if message == "resolution" then
                DoNothing
            else
                NextGame message
