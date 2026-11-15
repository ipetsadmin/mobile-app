import { Share } from "react-native"

import { renderHookWithProviders } from "@/test/render-with-providers"
import { translate } from "@/test/translate"

import { useShareHealthCard } from "./use-share-health-card"

describe("useShareHealthCard", () => {
  it("shares a message with the name of the pet", async () => {
    const share = jest
      .spyOn(Share, "share")
      .mockResolvedValue({ action: "sharedAction" })
    const { result } = await renderHookWithProviders(() =>
      useShareHealthCard("Luna"),
    )

    result.current()

    expect(share).toHaveBeenCalledWith({
      message: translate("healthCard.shareMessage", { name: "Luna" }),
    })
  })
})
